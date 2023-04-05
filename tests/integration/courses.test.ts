import app, { init } from '@/app';
import { Course, User } from '@prisma/client';
import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { createUser, createCourse } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import coursesService from '@/services/courses-service';

beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('Middleware authenticateToken', () => {
  let validToken: string;

  beforeEach(async () => {
    validToken = await generateValidToken();
  });
  it('should allow access to the endpoint if the token is valid', async () => {
    const response = await server.get('/courses').set('Authorization', `Bearer ${validToken}`);
    expect(response.status).toBe(httpStatus.OK);
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
    const invalidToken = faker.internet.password;

    const response = await server.get('/courses').set('Authorization', `Bearer ${invalidToken}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
});

describe('Courses Controller', () => {
  let validToken: string;
  let user: User;
  let course: Course;

  beforeEach(async () => {
    user = await createUser();
    course = await createCourse();
    validToken = await generateValidToken(user);
  });

  describe('GET /courses', () => {
    it('should return all courses', async () => {
      const response = await server.get('/courses').set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(httpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
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

      await coursesService.unsubscribeFromCourse(subscription.id, user.id);
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

      await coursesService.unsubscribeFromCourse(response.body.id, user.id);
    });
  });

  describe('DELETE /courses/subscribe/:subscriptionId', () => {
    it('should unsubscribe the user from the course', async () => {
      const subscription = await coursesService.subscribeToCourse(user.id, course.id);

      const response = await server
        .delete(`/courses/subscribe/${subscription.id}`)
        .set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(httpStatus.OK);

      const subscribedCourse = await coursesService.listUserCourses(subscription.id);
      expect(subscribedCourse).toEqual([]);
    });
  });
});
