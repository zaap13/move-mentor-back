import { prisma } from '@/config';

async function findCourses() {
  return prisma.course.findMany();
}

async function findCourse(id: number) {
  return prisma.course.findFirst({
    where: { id },
  });
}

async function checkSub(id: number, courseId: number) {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: id,
      courseId: courseId,
    },
  });

  return Boolean(subscription);
}

async function findCoursesByUserId(userId: number) {
  const courses = await prisma.course.findMany({
    where: {
      subscriptions: {
        some: {
          userId: userId,
        },
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
      lessons: {
        select: {
          id: true,
          title: true,
          progresses: {
            select: {
              completed: true,
            },
            where: {
              userId: userId,
              completed: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
  return courses;
}

async function subscribeToCourse(userId: number, courseId: number) {
  const subscription = await prisma.subscription.create({
    data: {
      userId,
      courseId,
    },
  });
  return subscription;
}

async function unsubscribeFromCourse(subscriptionId: number) {
  await prisma.subscription.delete({
    where: {
      id: subscriptionId,
    },
  });
  return;
}

async function createCourse(title: string, description: string, image: string, category: string, creatorId: number) {
  const course = await prisma.course.create({
    data: {
      title,
      description,
      image,
      category,
      creator: {
        connect: { id: creatorId },
      },
    },
  });
  return course;
}

async function updateCourse(id: number, title: string, description: string, image: string, category: string) {
  const course = await prisma.course.update({
    where: { id },
    data: {
      title,
      description,
      image,
      category,
    },
  });

  return course;
}

async function deleteCourse(id: number) {
  await prisma.subscription.deleteMany({
    where: { courseId: id },
  });
  await prisma.progress.deleteMany({
    where: { Lesson: { courseId: id } },
  });
  await prisma.lesson.deleteMany({
    where: { courseId: id },
  });
  await prisma.course.delete({
    where: { id },
  });
  return;
}

const coursesRepository = {
  findCoursesByUserId,
  findCourses,
  subscribeToCourse,
  unsubscribeFromCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  findCourse,
  checkSub,
};

export default coursesRepository;
