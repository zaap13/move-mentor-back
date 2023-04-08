import { Course } from '@prisma/client';
import Joi from 'joi';

export const createCourseSchema = Joi.object<Course>({
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required(),
  category: Joi.string().required(),
});
