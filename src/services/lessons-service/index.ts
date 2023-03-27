import { Lesson } from '.prisma/client';
import lessonsRepository from '@/repositories/lessons-repository';

interface LessonWithProgress extends Lesson {
  completed: boolean;
}

interface CompleteLessonDTO {
  userId: number;
  lessonId: number;
}

async function getLesson(id: number, userId: number): Promise<LessonWithProgress> {
  const lesson = await lessonsRepository.findLessonByIdWithProgress(id, userId);
  return lesson;
}

async function completeLesson(dto: CompleteLessonDTO): Promise<void> {
  await lessonsRepository.completeLesson(dto.lessonId, dto.userId);
}

const lessonsService = {
  getLesson,
  completeLesson,
};

export default lessonsService;
