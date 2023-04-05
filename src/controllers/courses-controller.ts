import { Request, Response } from 'express';
import coursesService from '@/services/courses-service';
import { AuthenticatedRequest } from '@/middlewares';

export async function getCourses(req: AuthenticatedRequest, res: Response) {
  try {
    const courses = await coursesService.listCourses();
    res.send(courses);
  } catch (error) {
    res.sendStatus(500);
  }
}

export async function getUserCourses(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const courses = await coursesService.listUserCourses(Number(userId));
    res.send(courses);
  } catch (error) {
    res.sendStatus(500);
  }
}

export async function subscribeCourse(req: AuthenticatedRequest, res: Response) {
  const { courseId } = req.body;
  const { userId } = req;

  try {
    const subscription = await coursesService.subscribeToCourse(userId, courseId);
    res.send(subscription);
  } catch (error) {
    res.sendStatus(500);
  }
}

export async function deleteSubscribe(req: AuthenticatedRequest, res: Response): Promise<void> {
  const subscriptionId = Number(req.params.subscriptionId);
  const { userId } = req;

  try {
    await coursesService.unsubscribeFromCourse(subscriptionId, userId);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
}
