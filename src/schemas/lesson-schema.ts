import { Lesson } from '@prisma/client';
import Joi from 'joi';

export const createLessonSchema = Joi.object<Lesson>({
  title: Joi.string().required(),
  description: Joi.string().required(),
  position: Joi.string().required(),
  courseId: Joi.number().required(),
  userColor: Joi.string().required(),
  moves: Joi.array().required(),
  messages: Joi.object().required(),
});
