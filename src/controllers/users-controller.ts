import userService from '@/services/users-service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function usersPost(req: Request, res: Response) {
  const { email, password, username, image } = req.body;

  try {
    const user = await userService.createUser({ email, password, username, image });
    return res.status(httpStatus.CREATED).json({
      id: user.id,
      email: user.email,
      username: user.username,
      image: user.image,
    });
  } catch (error) {
    return res.status(httpStatus.CONFLICT).send(error);
  }
}
