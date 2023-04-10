import coursesRepository from '@/repositories/courses-repository';
import httpStatus from 'http-status';

async function listCourses() {
  const courses = await coursesRepository.findCourses();
  return courses;
}

async function findCourse(userId: number, id: number) {
  const course = await coursesRepository.findCourse(id);
  const subscribe = await coursesRepository.checkSub(userId, id);
  if (!course) {
    throw new Error();
  }
  const result = { ...course, subscribe };
  return result;
}

async function listUserCourses(userId: number) {
  const courses = await coursesRepository.findCoursesByUserId(userId);
  return courses;
}

async function createCourse(title: string, description: string, image: string, category: string, userId: number) {
  const course = await coursesRepository.createCourse(title, description, image, category, userId);
  return course;
}

async function updateCourse(id: number, title: string, description: string, image: string, category: string) {
  const course = await coursesRepository.updateCourse(id, title, description, image, category);
  return course;
}

async function deleteCourse(id: number, userId: number) {
  await coursesRepository.deleteCourse(id);
  return;
}

async function subscribeToCourse(userId: number, courseId: number) {
  const subscription = await coursesRepository.subscribeToCourse(userId, courseId);
  return subscription;
}

async function unsubscribeFromCourse(subscriptionId: number) {
  await coursesRepository.unsubscribeFromCourse(subscriptionId);
  return;
}

const coursesService = {
  listCourses,
  listUserCourses,
  subscribeToCourse,
  unsubscribeFromCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  findCourse,
};

export default coursesService;
