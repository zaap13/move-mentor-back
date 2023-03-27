import coursesRepository from '@/repositories/courses-repository';

async function listCourses() {
  const courses = await coursesRepository.findCourses();
  return courses;
}

async function listUserCourses(userId: number) {
  const courses = await coursesRepository.findCoursesByUserId(userId);
  return courses;
}

async function subscribeToCourse(userId: number, courseId: number) {
  const subscription = await coursesRepository.subscribeToCourse(userId, courseId);
  return subscription;
}

async function unsubscribeFromCourse(userId: number, subscriptionId: number) {
  const subscription = await coursesRepository.unsubscribeFromCourse(subscriptionId, userId);
  return subscription;
}

const coursesService = {
  listCourses,
  listUserCourses,
  subscribeToCourse,
  unsubscribeFromCourse,
};

export default coursesService;
