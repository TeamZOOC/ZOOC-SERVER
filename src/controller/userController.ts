import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { rm, sc } from '../constants';
import { fail, success } from '../constants/response';
import userService from '../service/userService';

const signInKakao = async (req: Request, res: Response) => {
  const headers = req.headers['authorization'];
  const kakaoToken: string | undefined = headers?.split(' ')[1];
  // const kakaoToken = 'lrtqU2I-F20rF6-ChgSXkbY4ZjFi6-qijDKfmaLpCiolkQAAAYV330xt';

  const { jwtToken, isExistedUser } = await userService.signInKakao(kakaoToken);

  return res.status(200).send(
    success(sc.OK, rm.SIGNIN_SUCCESS, {
      jwtToken: jwtToken,
      isExistedUser: isExistedUser,
    })
  );
};

const signInApple = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    }

    const { identityTokenString } = req.body;

    const { jwtToken, isExistedUser } = await userService.verifyIdentityToken(
      identityTokenString
    );

    return res.status(200).send(
      success(sc.OK, rm.SIGNIN_SUCCESS, {
        jwtToken: jwtToken,
        isExistedUser: isExistedUser,
      })
    );
  } catch (error) {
    next(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

//~ 회원 탈퇴
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId: number = req.body.userId;
  try {
    await userService.deleteUser(userId);
    return res.status(sc.OK).send(success(sc.OK, rm.DELETE_USER_SUCCESS));
  } catch (error: any) {
    if (error === 'unauthorized apple token')
      return res
        .status(sc.UNAUTHORIZED)
        .send(fail(sc.UNAUTHORIZED, rm.UNAUTHORIZED_APPLE_TOKEN));

    next(error);

    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const patchUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, nickName } = req.body;
  const is_photo = req.query.photo === 'true' ? true : false;
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
    next(error);

    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

//* fcm token 갱신
const updateFcmToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    }

    const { userId, fcmToken } = req.body;
    await userService.updateFcmToken(+userId, fcmToken);

    return res
      .status(sc.OK)
      .send(success(sc.CREATED, rm.CREATE_FCM_TOKEN_SUCCESS));
  } catch (error: any) {
    if (error.message === 'token already saved') {
      return res
        .status(sc.OK)
        .send(success(sc.OK, rm.CREATE_FCM_TOKEN_SUCCESS));
    }
    next(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

//* 로그아웃
const signOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    }

    const { userId, fcmToken } = req.body;
    await userService.signOut(userId, fcmToken);

    return res.status(sc.OK).send(success(sc.OK, rm.SIGNOUT_SUCCESS));
  } catch (error: any) {
    if (error.message === 'token not exist')
      return res.status(sc.OK).send(success(sc.OK, rm.SIGNOUT_SUCCESS));

    next(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const userController = {
  signInKakao,
  signInApple,
  patchUserProfile,
  deleteUser,
  updateFcmToken,
  signOut,
};

export default userController;
