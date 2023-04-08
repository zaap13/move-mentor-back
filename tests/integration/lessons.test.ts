import app, { init } from '@/app';
import { Course, User, Lesson } from '@prisma/client';
import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { createUser, createCourse } from '../factories';
import { cleanDb, generateInvalidToken, generateValidToken } from '../helpers';

export interface CourseWithLessons extends Course {
  lessons: Lesson[];
}

beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('Lessons Controller', () => {
  let validToken: string;
  let course: CourseWithLessons;
  let user: User;

  beforeEach(async () => {
    user = await createUser();
    validToken = await generateValidToken(user);
    course = await createCourse(user);
  });

  describe('GET /lesson/:id', () => {
    it('should return a lesson if the user has access to it', async () => {
      const lesson = course.lessons[1];
      await server
        .post('/courses/subscribe')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ courseId: course.lessons[1].courseId });
      const response = await server.get(`/lesson/${lesson.id}`).set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toMatchObject({ id: lesson.id });
    });

    it('should return 403 if the user has no access to it', async () => {
      const lesson = course.lessons[1];
      const response = await server.get(`/lesson/${lesson.id}`).set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should return status 404 if the lesson does not exist', async () => {
      const response = await server
        .get(`/lesson/${faker.datatype.number()}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should return status 401 if there is no token in the header', async () => {
      const response = await server.get(`/lesson/${course.lessons[0].id}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should return status 401 if the token is invalid', async () => {
      const response = await server.get(`/lesson/${course.lessons[0].id}`).set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should return status 401 if there is no session corresponding to the token', async () => {
      const invalidToken = generateInvalidToken();

      const response = await server
        .get(`/lesson/${course.lessons[0].id}`)
        .set('Authorization', `Bearer ${invalidToken}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('POST /lesson/complete/:id', () => {
    it('should mark a lesson as completed for a given user', async () => {
      const lesson = course.lessons[0];

      await server
        .post('/courses/subscribe')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ courseId: lesson.courseId });

      const response = await server.post(`/lesson/complete/${lesson.id}`).set('Authorization', `Bearer ${validToken}`);
      const check = await server.get(`/lesson/${lesson.id}`).set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(check.body.progresses).toBe(true);
    });

    it('should return status 404 if the lesson does not exist', async () => {
      const response = await server
        .post(`/lesson/complete/${faker.datatype.number()}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should return status 401 if there is no token in the header', async () => {
      const response = await server.post(`/lesson/complete/${course.lessons[0].id}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should return status 401 if the token is invalid', async () => {
      const response = await server
        .post(`/lesson/complete/${course.lessons[0].id}`)
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should return status 401 if there is no session corresponding to the token', async () => {
      const invalidToken = generateInvalidToken();

      const response = await server
        .post(`/lesson/complete/${course.lessons[0].id}`)
        .set('Authorization', `Bearer ${invalidToken}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('POST /lesson', () => {
    let lessonData: Object;
    beforeEach(() => {
      lessonData = {
        title: faker.lorem.words(2),
        description: faker.lorem.paragraph(),
        position: faker.datatype.string(),
        courseId: course.id,
        userColor: 'w',
        moves: [faker.random.word(), faker.random.word(), faker.random.word()],
        messages: {
          from: faker.internet.email(),
          to: faker.internet.email(),
          subject: faker.lorem.sentence(),
          body: faker.lorem.paragraph(),
        },
      };
    });

    it('should create a new lesson for a course', async () => {
      const response = await server.post('/lesson').set('Authorization', `Bearer ${validToken}`).send(lessonData);

      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body).toMatchObject(lessonData);
      expect(response.body).toHaveProperty('id');
    });

    it('should return status 400 if there is no body', async () => {
      const response = await server.post('/lesson').set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should return status 400 if the body is invalid', async () => {
      const invalidBody = { invalid: 'invalid' };
      const response = await server.post('/lesson').set('Authorization', `Bearer ${validToken}`).send(invalidBody);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should return status 401 if there is no token in the header', async () => {
      const response = await server.post('/lesson').send({});

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should return status 401 if the token is invalid', async () => {
      const response = await server.post('/lesson').set('Authorization', 'Bearer invalid_token').send({});

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should return status 403 if the user is not authorized to create a lesson for the course', async () => {
      const anotherUserToken = await generateInvalidToken();
      const response = await server.post('/lesson').set('Authorization', `Bearer ${anotherUserToken}`).send(lessonData);
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should return status 404 if the course does not exist', async () => {
      const invalidBody = { ...lessonData, courseId: 0 };
      const response = await server.post('/lesson').set('Authorization', `Bearer ${validToken}`).send(invalidBody);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
  });
  describe('Patch /lesson/:id', () => {
    let lessonData: Object;
    beforeEach(() => {
      lessonData = {
        title: faker.lorem.words(2),
        description: faker.lorem.paragraph(),
        position: faker.datatype.string(),
        courseId: course.id,
        userColor: 'w',
        moves: [faker.random.word(), faker.random.word(), faker.random.word()],
        messages: {
          from: faker.internet.email(),
          to: faker.internet.email(),
          subject: faker.lorem.sentence(),
          body: faker.lorem.paragraph(),
        },
      };
    });

    it('should update a lesson for a course', async () => {
      await server
        .post('/courses/subscribe')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ courseId: course.lessons[0].courseId });
      const response = await server
        .patch(`/lesson/${course.lessons[0].id}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send(lessonData);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toMatchObject(lessonData);
      expect(response.body).toHaveProperty('id');
    });

    it('should return status 400 if there is no body', async () => {
      const response = await server
        .patch(`/lesson/${course.lessons[0].id}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should return status 400 if the body is invalid', async () => {
      const invalidBody = { invalid: 'invalid' };
      const response = await server
        .patch(`/lesson/${course.lessons[0].id}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send(invalidBody);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should return status 401 if there is no token in the header', async () => {
      const response = await server.patch(`/lesson/${course.lessons[0].id}`).send({});

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should return status 401 if the token is invalid', async () => {
      const response = await server
        .patch(`/lesson/${course.lessons[0].id}`)
        .set('Authorization', 'Bearer invalid_token')
        .send({});

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should return status 403 if the user is not authorized to create a lesson for the course', async () => {
      const anotherUserToken = await generateInvalidToken();
      const response = await server
        .patch(`/lesson/${course.lessons[0].id}`)
        .set('Authorization', `Bearer ${anotherUserToken}`)
        .send(lessonData);
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should return status 404 if the course does not exist', async () => {
      const invalidBody = { ...lessonData, courseId: 0 };
      const response = await server
        .patch(`/lesson/${course.lessons[0].id}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send(invalidBody);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should return status 404 if the lesson does not exist', async () => {
      const response = await server.patch(`/lesson/0`).set('Authorization', `Bearer ${validToken}`).send(lessonData);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
  });

  describe('Delete /lesson/:id', () => {
    it('should delete the lesson with the specified id', async () => {
      const response = await server
        .delete(`/lesson/${course.lessons[0].id}`)
        .set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(httpStatus.OK);

      const deletedCourse = await server
        .get(`/lesson/${course.lessons[0].id}`)
        .set('Authorization', `Bearer ${validToken}`);
      expect(deletedCourse.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should return status 404 if the lesson does not exist', async () => {
      const response = await server.delete(`/lesson/0`).set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should return 403 if the user has no access to it', async () => {
      const alternativeToken = await generateValidToken();
      const response = await server
        .delete(`/lesson/${course.lessons[0].id}`)
        .set('Authorization', `Bearer ${alternativeToken}`);

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });
    it('should return status 401 if there is no token in the header', async () => {
      const response = await server.delete(`/lesson/${course.lessons[0].id}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should return status 401 if the token is invalid', async () => {
      const response = await server
        .delete(`/lesson/${course.lessons[0].id}`)
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should return status 401 if there is no session corresponding to the token', async () => {
      const invalidToken = generateInvalidToken();

      const response = await server
        .delete(`/lesson/${course.lessons[0].id}`)
        .set('Authorization', `Bearer ${invalidToken}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });
});
