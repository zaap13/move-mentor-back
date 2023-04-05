import { prisma } from '@/config';
import faker from '@faker-js/faker';
import { CourseWithLessons } from '../integration/lessons.test';
import { createUser } from './users-factory';

export async function createCourse() {
  const user = await createUser();

  const title = faker.lorem.words(3);
  const description = faker.lorem.sentence();
  const image = faker.image.imageUrl();
  const category = faker.lorem.word();

  const course = await prisma.course.create({
    data: {
      title,
      description,
      image,
      category,
      creator: {
        connect: {
          id: user.id,
        },
      },
      lessons: {
        createMany: {
          data: [
            {
              title: faker.lorem.words(2),
              description: faker.lorem.sentence(),
              position: faker.lorem.lines(1),
              moves: faker.datatype.array().toString(),
              userColor: 'w',
              messages: faker.datatype.json(),
            },

            {
              title: faker.lorem.words(2),
              description: faker.lorem.sentence(),
              position: faker.lorem.lines(1),
              moves: faker.datatype.array().toString(),
              userColor: 'b',
              messages: faker.datatype.json(),
            },
          ],
        },
      },
    },
    include: {
      lessons: true,
    },
  });

  return course as CourseWithLessons;
}
