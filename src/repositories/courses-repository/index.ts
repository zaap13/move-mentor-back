import { prisma } from '@/config';

async function findCourses() {
  return prisma.course.findMany();
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
    include: {
      lessons: true,
      subscriptions: {
        where: {
          userId: userId,
        },
        select: {
          progress: true,
        },
      },
    },
  });

  const coursesWithProgress = courses.map((course) => ({
    ...course,
    progress: Math.round((course.subscriptions[0].progress / course.lessons.length) * 100),
  }));

  return coursesWithProgress;
}

async function subscribeToCourse(userId: number, courseId: number) {
  console.log('alo');

  const subscription = await prisma.subscription.create({
    data: {
      userId,
      courseId,
    },
  });
  return subscription;
}

async function unsubscribeFromCourse(subscriptionId: number, userId: number) {
  const user = await prisma.subscription.findFirst({
    where: {
      userId: userId,
    },
  });

  if (!user) {
    return;
  }

  const subscription = await prisma.subscription.delete({
    where: {
      id: subscriptionId,
    },
  });
  return subscription;
}

const coursesRepository = {
  findCoursesByUserId,
  findCourses,
  subscribeToCourse,
  unsubscribeFromCourse,
};

export default coursesRepository;
