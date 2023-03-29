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
