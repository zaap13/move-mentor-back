import { Lesson, Prisma, UserColor } from '@prisma/client';
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

async function completeLesson(lessonId: number, userId: number) {
  const progress = await prisma.progress.create({
    data: {
      completed: true,
      userId: userId,
      lessonId: lessonId,
    },
  });
}

async function addLesson(
  title: string,
  description: string,
  courseId: number,
  position: string,
  moves: string[],
  messages: Prisma.JsonValue,
  userColor: UserColor,
) {
  const newLesson = await prisma.lesson.create({
    data: { title, description, courseId, position, moves, messages, userColor },
  });
  return newLesson;
}

async function updateLesson(
  id: number,
  title: string,
  description: string,
  courseId: number,
  position: string,
  moves: string[],
  messages: Prisma.JsonValue,
  userColor: UserColor,
) {
  const updatedLesson = await prisma.lesson.update({
    where: {
      id: id,
    },
    data: { title, description, courseId, position, moves, messages, userColor },
  });
  return updatedLesson;
}

async function deleteLesson(id: number) {
  const deletedLesson = await prisma.lesson.delete({
    where: {
      id: id,
    },
  });
  return deletedLesson;
}

const lessonsRepository = {
  findLessonByIdWithProgress,
  completeLesson,
  addLesson,
  updateLesson,
  deleteLesson,
};

export default lessonsRepository;
