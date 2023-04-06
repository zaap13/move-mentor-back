import app, { init } from '@/app';
import { Course, User, Lesson } from '@prisma/client';
import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { createUser, createCourse } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import coursesService from '@/services/courses-service';
import { number } from 'joi';

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

describe('Middleware authenticateToken', () => {
  let validToken: string;
  let course: CourseWithLessons;

  beforeEach(async () => {
    validToken = await generateValidToken();
    course = await createCourse();
  });
  it('should allow access to the endpoint if the token is valid', async () => {
    await server
      .post('/courses/subscribe')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ courseId: course.lessons[0].courseId });
    const response = await server.get(`/lesson/${course.lessons[0].id}`).set('Authorization', `Bearer ${validToken}`);
    expect(response.status).toBe(httpStatus.OK);
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
    const invalidToken = faker.internet.password;

    const response = await server.get(`/lesson/${course.lessons[0].id}`).set('Authorization', `Bearer ${invalidToken}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
});

describe('Lessons Controller', () => {
  let validToken: string;
  let course: CourseWithLessons;

  beforeEach(async () => {
    validToken = await generateValidToken();
    course = await createCourse();
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
  });
});
