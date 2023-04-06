import { Response } from 'express';
import coursesService from '@/services/courses-service';
import { AuthenticatedRequest } from '@/middlewares';
import httpStatus from 'http-status';

export async function getCourses(req: AuthenticatedRequest, res: Response) {
  try {
    const courses = await coursesService.listCourses();
    res.send(courses);
  } catch (error) {
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function postCourse(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { title, description, image, category } = req.body;

  try {
    const course = await coursesService.createCourse(title, description, image, category, userId);
    if (!course) {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    res.status(httpStatus.OK).send(course);
  } catch (error) {
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function patchCourse(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const id = Number(req.params.id);
  const { title, description, image, category } = req.body;

  try {
    const course = await coursesService.updateCourse(id, title, description, image, category, userId);
    if (!course) {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    res.status(httpStatus.OK).send(course);
  } catch (error) {
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function deleteCourse(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const id = Number(req.params.id);

  try {
    const course = await coursesService.deleteCourse(id, userId);
    if (!course) {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    res.sendStatus(httpStatus.OK);
  } catch (error) {
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getUserCourses(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const courses = await coursesService.listUserCourses(Number(userId));
    res.send(courses);
  } catch (error) {
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function subscribeCourse(req: AuthenticatedRequest, res: Response) {
  const { courseId } = req.body;
  const { userId } = req;

  try {
    const subscription = await coursesService.subscribeToCourse(userId, courseId);
    res.send(subscription);
  } catch (error) {
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function deleteSubscribe(req: AuthenticatedRequest, res: Response): Promise<void> {
  const subscriptionId = Number(req.params.subscriptionId);
  const { userId } = req;

  try {
    await coursesService.unsubscribeFromCourse(subscriptionId, userId);
    res.sendStatus(httpStatus.OK);
  } catch (error) {
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
