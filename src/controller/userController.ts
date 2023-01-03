import { Request, Response } from 'express';
import userService from '../service/userService';

const signInKakao = async (req: Request, res: Response) => {
  const headers = req.headers['authorization'];
  const kakaoToken = headers?.split(' ')[1];

  const accessToken = await userService.signInKakao(kakaoToken);

  return res.status(200).json({ accessToken: accessToken });
};

const userController = {
  signInKakao,
};

export default userController;
