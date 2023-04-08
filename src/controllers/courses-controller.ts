import { Response } from 'express';
import coursesService from '@/services/courses-service';
import { AuthenticatedRequest } from '@/middlewares';
import httpStatus from 'http-status';

export async function getCourses(req: AuthenticatedRequest, res: Response) {
  const courses = await coursesService.listCourses();
  res.send(courses);
}

export async function postCourse(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { title, description, image, category } = req.body;

  const course = await coursesService.createCourse(title, description, image, category, userId);
  res.status(httpStatus.CREATED).send(course);
}

export async function patchCourse(req: AuthenticatedRequest, res: Response) {
  const id = Number(req.params.id);
  const { title, description, image, category } = req.body;

  const course = await coursesService.updateCourse(id, title, description, image, category);

  res.status(httpStatus.OK).send(course);
}

export async function deleteCourse(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const id = Number(req.params.id);

  await coursesService.deleteCourse(id, userId);

  res.sendStatus(httpStatus.OK);
}

export async function getUserCourses(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const courses = await coursesService.listUserCourses(Number(userId));
  res.send(courses);
}

export async function subscribeCourse(req: AuthenticatedRequest, res: Response) {
  const { courseId } = req.body;
  const { userId } = req;
  try {
    const subscription = await coursesService.subscribeToCourse(userId, courseId);
    res.send(subscription);
  } catch (error) {
    res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function deleteSubscribe(req: AuthenticatedRequest, res: Response): Promise<void> {
  const subscriptionId = Number(req.params.subscriptionId);
  try {
    await coursesService.unsubscribeFromCourse(subscriptionId);
    res.sendStatus(httpStatus.OK);
  } catch (error) {
    res.sendStatus(httpStatus.NOT_FOUND);
  }
}
