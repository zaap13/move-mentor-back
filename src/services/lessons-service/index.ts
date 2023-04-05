import { Lesson } from '.prisma/client';
import lessonsRepository from '@/repositories/lessons-repository';
import httpStatus from 'http-status';

async function getLesson(id: number, userId: number): Promise<Lesson> {
  const lesson = await lessonsRepository.findLessonByIdWithProgress(id, userId);

  return lesson;
}

async function completeLesson(id: number, userId: number): Promise<void> {
  await lessonsRepository.completeLesson(id, userId);
}

const lessonsService = {
  getLesson,
  completeLesson,
};

export default lessonsService;
