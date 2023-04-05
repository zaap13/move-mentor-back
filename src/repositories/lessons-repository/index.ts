import { prisma } from '@/config';

async function findLessonByIdWithProgress(lessonId: number, userId: number) {
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    include: {
      progresses: {
        where: {
          userId: userId,
        },
        select: {
          completed: true,
        },
      },
    },
  });

  const completed = lesson.progresses.length > 0 ? lesson.progresses[0].completed : false;

  return {
    ...lesson,
    progresses: completed,
  };
}

async function completeLesson(id: number, userId: number) {
  const progress = await prisma.progress.create({
    data: {
      completed: true,
      userId: userId,
      lessonId: id,
    },
  });
}

const lessonsRepository = {
  findLessonByIdWithProgress,
  completeLesson,
};

export default lessonsRepository;
