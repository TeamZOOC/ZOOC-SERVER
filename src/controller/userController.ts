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
    if (is_photo) {
      if (!req.file) {
        // 별명만 수정
        const data = await userService.patchUserNickName(+userId, nickName);

        return res
          .status(sc.OK)
          .send(success(sc.OK, rm.UPDATE_USER_PROFILE_SUCCESS, data));
      }

      // 사진 & 별명 수정
      const image: Express.MulterS3.File = req.file as Express.MulterS3.File;
      const { location } = image;

      const data = await userService.patchUserPhotoAndNickName(
        +userId,
        location,
        nickName
      );

      return res
        .status(200)
        .send(success(sc.OK, rm.UPDATE_USER_PROFILE_SUCCESS, data));
    }

    // 사진 삭제 & 별명 수정
    const data = await userService.patchUserPhotoAndNickName(
      +userId,
      null,
      nickName
    );

    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.UPDATE_USER_PROFILE_SUCCESS, data));
  } catch (error) {
    console.error(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const userController = {
  signInKakao,
  patchUserProfile,
};

export default userController;
