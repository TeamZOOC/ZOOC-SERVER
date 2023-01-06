import { Request, Response } from 'express';
import { rm, sc } from '../constants';
import { fail, success } from '../constants/response';
import userService from '../service/userService';

const signInKakao = async (req: Request, res: Response) => {
  const headers = req.headers['authorization'];
  const kakaoToken: string | undefined = headers?.split(' ')[1];
  // const kakaoToken = 'lrtqU2I-F20rF6-ChgSXkbY4ZjFi6-qijDKfmaLpCiolkQAAAYV330xt';

  const jwtToken = await userService.signInKakao(kakaoToken);

  return res.status(200).json({ jwtToken: jwtToken });
};

const patchUserProfile = async (req: Request, res: Response) => {
  const { userId, nickName } = req.body;
  const is_photo = req.query.photo;

  try {
    // 사진 존재할 시 사진 & 닉네임 수정
    if (is_photo) {
      const image: Express.MulterS3.File = req.file as Express.MulterS3.File;
      const { location } = image;

      const data = userService.patchUserPhotoAndNickName(
        +userId,
        location,
        nickName
      );

      return res
        .status(200)
        .send(success(sc.OK, rm.UPDATE_USER_PROFILE_SUCCESS, data));
    }
  } catch (error) {
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }

  // 사진 존재하지 않을 시

  // 닉네임 수정 (photo false)
};

const userController = {
  signInKakao,
  patchUserProfile,
};

export default userController;
