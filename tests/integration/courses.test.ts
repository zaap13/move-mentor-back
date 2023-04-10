import app, { init } from '@/app';
import { Course, Subscription, User } from '@prisma/client';
import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { createUser, createCourse } from '../factories';
import { cleanDb, generateInvalidToken, generateValidToken } from '../helpers';
import coursesService from '@/services/courses-service';

beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('Courses Controller', () => {
  let validToken: string;
  let user: User;
  let course: Course;

  beforeEach(async () => {
    user = await createUser();
    course = await createCourse(user);
    validToken = await generateValidToken(user);
  });

  describe('GET /courses', () => {
    it('should return all courses', async () => {
      const response = await server.get('/courses').set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(httpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
    it('should return status 401 if there is no token in the header', async () => {
      const response = await server.get('/courses');
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should return status 401 if the token is invalid', async () => {
      const response = await server.get('/courses').set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should return status 401 if there is no session corresponding to the token', async () => {
      const invalidToken = generateInvalidToken();

      const response = await server.get('/courses').set('Authorization', `Bearer ${invalidToken}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /courses/:id', () => {
    it('should return expecific course', async () => {
      const response = await server.get(`/courses/${course.id}`).set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toMatchObject({ id: course.id });
    });
    it('should return status 404 if the course dont exists', async () => {
      const response = await server.get(`/courses/0`).set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    it('should return status 401 if there is no token in the header', async () => {
      const response = await server.get(`/courses/${course.id}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should return status 401 if the token is invalid', async () => {
      const response = await server.get(`/courses/${course.id}`).set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should return status 401 if there is no session corresponding to the token', async () => {
      const invalidToken = generateInvalidToken();

      const response = await server.get(`/courses/${course.id}`).set('Authorization', `Bearer ${invalidToken}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /courses/subscribed', () => {
    it('should return all courses subscribed by the user', async () => {
      const subscription = await coursesService.subscribeToCourse(user.id, course.id);

      const response = await server.get('/courses/subscribed').set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(httpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].id).toBe(course.id);

      await coursesService.unsubscribeFromCourse(subscription.id);
    });
    it('should return status 401 if there is no token in the header', async () => {
      const response = await server.get('/courses/subscribed');
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should return status 401 if the token is invalid', async () => {
      const response = await server.get('/courses/subscribed').set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should return status 401 if there is no session corresponding to the token', async () => {
      const invalidToken = generateInvalidToken();

      const response = await server.get('/courses/subscribed').set('Authorization', `Bearer ${invalidToken}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('POST /courses/subscribe', () => {
    it('should subscribe the user to the course', async () => {
      const response = await server
        .post('/courses/subscribe')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ courseId: course.id });
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.userId).toBe(user.id);
      expect(response.body.courseId).toBe(course.id);

      await coursesService.unsubscribeFromCourse(response.body.id);
    });
    it('should return status 404 if the course does not exist', async () => {
      const response = await server
        .post('/courses/subscribe')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ courseId: 0 });
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    it('should return status 401 if there is no token in the header', async () => {
      const response = await server.post('/courses/subscribe');
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should return status 401 if the token is invalid', async () => {
      const response = await server.post('/courses/subscribe').set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should return status 401 if there is no session corresponding to the token', async () => {
      const invalidToken = generateInvalidToken();

      const response = await server.post('/courses/subscribe').set('Authorization', `Bearer ${invalidToken}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('DELETE /courses/subscribe/:subscriptionId', () => {
    let subscription: Subscription;

    beforeEach(async () => {
      subscription = await coursesService.subscribeToCourse(user.id, course.id);
    });

    it('should unsubscribe the user from the course', async () => {
      const response = await server
        .delete(`/courses/subscribe/${subscription.id}`)
        .set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(httpStatus.OK);

      const subscribedCourse = await coursesService.listUserCourses(subscription.id);
      expect(subscribedCourse).toEqual([]);
    });

    it('should return status 404 if the course does not exist', async () => {
      const response = await server.delete(`/courses/subscribe/0`).set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(httpStatus.NOT_FOUND);

      const subscribedCourse = await coursesService.listUserCourses(subscription.id);
      expect(subscribedCourse).toEqual([]);
    });

    it('should return status 401 if there is no token in the header', async () => {
      const response = await server.delete(`/courses/subscribe/${subscription.id}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should return status 401 if the token is invalid', async () => {
      const response = await server
        .delete(`/courses/subscribe/${subscription.id}`)
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should return status 401 if there is no session corresponding to the token', async () => {
      const invalidToken = generateInvalidToken();

      const response = await server
        .delete(`/courses/subscribe/${subscription.id}`)
        .set('Authorization', `Bearer ${invalidToken}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('POST /courses', () => {
    it('should create a new course', async () => {
      const newCourse = {
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        image: faker.internet.url(),
        category: faker.random.word(),
      };

      const response = await server.post('/courses').set('Authorization', `Bearer ${validToken}`).send(newCourse);

      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body.title).toBe(newCourse.title);
      expect(response.body.description).toBe(newCourse.description);
      expect(response.body.image).toBe(newCourse.image);
      expect(response.body.category).toBe(newCourse.category);
    });

    it('should return status 400 if there is no body', async () => {
      const response = await server.post('/courses').set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should return status 400 if there is a invalid body', async () => {
      const invalidBody = { invalid: 'invalid' };
      const response = await server.post('/courses').set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should return status 401 if there is no token in the header', async () => {
      const response = await server.post('/courses');
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should return status 401 if the token is invalid', async () => {
      const response = await server.post('/courses').set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should return status 401 if there is no session corresponding to the token', async () => {
      const invalidToken = generateInvalidToken();

      const response = await server.post('/courses').set('Authorization', `Bearer ${invalidToken}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('PATCH /courses/:id', () => {
    it('should update the course with the specified id', async () => {
      const updatedCourse = {
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        image: faker.internet.url(),
        category: faker.random.word(),
      };

      const response = await server
        .patch(`/courses/${course.id}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send(updatedCourse);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.id).toBe(course.id);
      expect(response.body.title).toBe(updatedCourse.title);
      expect(response.body.description).toBe(updatedCourse.description);
      expect(response.body.image).toBe(updatedCourse.image);
      expect(response.body.category).toBe(updatedCourse.category);
    });

    it('should return status 404 if the course does not exist', async () => {
      const response = await server.patch(`/courses/0`).set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should return status 400 if there is no body', async () => {
      const response = await server.patch(`/courses/${course.id}`).set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should return status 400 if there is a invalid body', async () => {
      const invalidBody = { invalid: 'invalid' };
      const response = await server
        .patch(`/courses/${course.id}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send(invalidBody);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should return 403 if the user has no access to it', async () => {
      const newCourse = {
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        image: faker.internet.url(),
        category: faker.random.word(),
      };
      const alternativeToken = await generateValidToken();
      const response = await server
        .patch(`/courses/${course.id}`)
        .set('Authorization', `Bearer ${alternativeToken}`)
        .send(newCourse);

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });
    it('should return status 401 if there is no token in the header', async () => {
      const response = await server.patch(`/courses/${course.id}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should return status 401 if the token is invalid', async () => {
      const response = await server.patch(`/courses/${course.id}`).set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should return status 401 if there is no session corresponding to the token', async () => {
      const invalidToken = generateInvalidToken();

      const response = await server.patch(`/courses/${course.id}`).set('Authorization', `Bearer ${invalidToken}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('DELETE /courses/:id', () => {
    it('should delete the course with the specified id', async () => {
      const response = await server.delete(`/courses/${course.id}`).set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(httpStatus.OK);

      const deletedCourse = await coursesService.listUserCourses(course.id);
      expect(deletedCourse).toEqual([]);
    });

    it('should return status 404 if the course does not exist', async () => {
      const response = await server.delete(`/courses/0`).set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should return 403 if the user has no access to it', async () => {
      const alternativeToken = await generateValidToken();
      const response = await server.delete(`/courses/${course.id}`).set('Authorization', `Bearer ${alternativeToken}`);

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });
    it('should return status 401 if there is no token in the header', async () => {
      const response = await server.delete(`/courses/${course.id}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should return status 401 if the token is invalid', async () => {
      const response = await server.delete(`/courses/${course.id}`).set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should return status 401 if there is no session corresponding to the token', async () => {
      const invalidToken = generateInvalidToken();

      const response = await server.delete(`/courses/${course.id}`).set('Authorization', `Bearer ${invalidToken}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });
});
