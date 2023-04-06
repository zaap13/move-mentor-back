import { Lesson, Prisma, UserColor } from '.prisma/client';
import lessonsRepository from '@/repositories/lessons-repository';
import httpStatus from 'http-status';

async function getLesson(id: number, userId: number): Promise<Lesson> {
  const lesson = await lessonsRepository.findLessonByIdWithProgress(id, userId);

  return lesson;
}

async function completeLesson(id: number, userId: number): Promise<void> {
  await lessonsRepository.completeLesson(id, userId);
}

async function createLesson(
  title: string,
  description: string,
  courseId: number,
  position: string,
  moves: string[],
  messages: Prisma.JsonValue,
  userColor: UserColor,
) {
  const lesson = await lessonsRepository.addLesson(title, description, courseId, position, moves, messages, userColor);
  return lesson;
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
  const lesson = await lessonsRepository.updateLesson(
    id,
    title,
    description,
    courseId,
    position,
    moves,
    messages,
    userColor,
  );
  return lesson;
}

async function deleteLesson(id: number) {
  const lesson = await lessonsRepository.deleteLesson(id);
  return lesson;
}

const lessonsService = {
  getLesson,
  completeLesson,
  createLesson,
  updateLesson,
  deleteLesson,
};

export default lessonsService;
