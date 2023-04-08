import { Lesson, Prisma, UserColor } from '.prisma/client';
import coursesRepository from '@/repositories/courses-repository';
import lessonsRepository from '@/repositories/lessons-repository';

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
  userId: number,
) {
  const check = await coursesRepository.findCourse(courseId);
  if (check.creatorId !== userId) {
    return;
  }
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
  userId: number,
) {
  const checkLesson = await lessonsRepository.findLessonByIdWithProgress(id, userId);
  const course = checkLesson.courseId;
  if (course !== courseId) {
    return;
  }

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

async function deleteLesson(id: number, userId: number) {
  const checkLesson = await lessonsRepository.findLessonByIdWithProgress(id, userId);
  const courseId = checkLesson.courseId;
  await lessonsRepository.deleteLesson(id);
  return;
}

const lessonsService = {
  getLesson,
  completeLesson,
  createLesson,
  updateLesson,
  deleteLesson,
};

export default lessonsService;
