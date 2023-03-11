import { UserLoginResponseDto } from './../interface/user/UserLoginResponseDto';
import { UserDto } from './../interface/user/UserDto';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { createPublicKey } from 'crypto';
import { PrismaClient } from '@prisma/client';
import jwtHandler from '../modules/jwtHandler';
const prisma = new PrismaClient();

const signUp = async (socialId: string, provider: string) => {
  const user = await prisma.user.create({
    data: {
      social_id: socialId,
      provider: provider,
      photo: null,
      nick_name: '',
      // fcm_token: null,
      jwt_token: '',
    },
  });
  const userId = user.id;
  const payload = {
    userId,
  };
  const jwtToken = jwtHandler.sign(payload);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      jwt_token: jwtToken,
    },
  });

  return jwtToken;
};

const signInKakao = async (
  kakaoToken: string | undefined
): Promise<UserLoginResponseDto> => {
  const result = await axios.get('https://kapi.kakao.com/v2/user/me', {
    headers: {
      Authorization: `Bearer ${kakaoToken}`,
    },
  });
  const { data } = result;
  const kakaoId: string = data.id.toString();

  if (!kakaoId) throw new Error('KEY_ERROR');

  const user = await prisma.user.findUnique({
    where: {
      social_id: kakaoId,
    },
  });

  //유저 없으면 회원가입
  if (!user) {
    const jwtToken = await signUp(kakaoId, 'kakao');
    return { jwtToken: jwtToken, isExistedUser: false };
  }
  //유저 있으면 jwt 토큰 생성
  const userId = user.id;
  const payload = {
    userId,
  };
  const jwtToken = jwtHandler.sign(payload);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      jwt_token: jwtToken,
    },
  });

  return { jwtToken: jwtToken, isExistedUser: true };
};

const getApplePublicKey = async () => {
  const result = await axios.get('https://appleid.apple.com/auth/keys');
  const { data } = result;

  return data.keys;
};

const verifyIdentityToken = async (
  identityTokenString: string
): Promise<UserLoginResponseDto> => {
  const JWTSet = await getApplePublicKey();
  const identityTokenHeader: string = identityTokenString?.split('.')[0];
  const { kid } = JSON.parse(atob(identityTokenHeader));

  let rightKeyN;
  let rightKeyE;
  let rightKeyKty;
  JWTSet.map((key: any) => {
    if (kid === key.kid) {
      rightKeyN = key.n;
      rightKeyE = key.e;
      rightKeyKty = key.kty;
    }
  });

  //맞는 공개키 재료 없을 때
  if (!rightKeyN || !rightKeyE) throw new Error('no right public key');

  const key = {
    n: rightKeyN,
    e: rightKeyE,
    kty: rightKeyKty,
  };

  const nBuffer = Buffer.from(key.n, 'base64');
  const eBuffer = Buffer.from(key.e, 'base64');

  const publicKey = createPublicKey({
    key: {
      kty: key.kty,
      n: nBuffer.toString('base64'),
      e: eBuffer.toString('base64'),
    },
    format: 'jwk',
  });

  const identityToken = identityTokenString;

  //verify 실패하면 안됨
  const userInfo = jwt.verify(identityToken, publicKey) as jwt.JwtPayload;
  if (!userInfo) throw new Error('unauthorized apple token');

  const userSocialId = userInfo.sub as string;

  //존재하는 유저인지 검색
  const user = await prisma.user.findUnique({
    where: {
      social_id: userSocialId,
    },
  });

  //존재하지 않는 유저면 회원가입
  //유저 없으면 회원가입
  if (!user) {
    const jwtToken = await signUp(userSocialId, 'apple');
    return { jwtToken: jwtToken, isExistedUser: false };
  }

  //존재하는 유저면??
  //유저 있으면 jwt 토큰 생성
  const userId = user.id;
  const payload = {
    userId,
  };

  const jwtToken = jwtHandler.sign(payload);
  return { jwtToken: jwtToken, isExistedUser: true };
};

//~ 유저 정보 불러오기
const getUser = async (userId: number): Promise<UserDto> => {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      nick_name: true,
      photo: true,
    },
  });

  if (data) return data;
  throw new Error('no user');
};

//~ 유저의 기록 경험 업데이트
const patchUserEverRecorded = async (userId: number) => {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ever_recorded: true,
    },
  });
};

//~ 사용자 프로필 사진 & 닉네임 수정하기
const patchUserPhotoAndNickName = async (
  userId: number,
  photo: string | null,
  nickName: string
) => {
  // 프로필 사진만 변경
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      photo: photo,
      nick_name: nickName,
    },
    select: {
      id: true,
      nick_name: true,
      photo: true,
    },
  });

  return user;
};

//~ 사용자 프로필 닉네임 수정하기
const patchUserNickName = async (userId: number, nickName: string) => {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      nick_name: nickName,
    },
    select: {
      id: true,
      nick_name: true,
      photo: true,
    },
  });

  return user;
};

//~ 유저 탈퇴
const deleteUser = async (userId: number) => {
  await prisma.user.delete({
    where: {
      id: userId,
    },
  });
};

//~ fcm token 저장
const updateFcmToken = async (userId: number, fcmToken: string) => {
  //! 기존 usertbl에 token 있을 때 코드
  // await prisma.user.update({
  //   where: {
  //     id: userId,
  //   },
  //   data: {
  //     fcm_token: fcmToken,
  //   },
  // });
  await prisma.fcmtoken.create({
    data: {
      user_id: userId,
      fcm_token: fcmToken,
    },
  });
};

//~ 로그아웃
const signOut = async (userId: number) => {
  // //! 기존 usertbl에 token 있을 때 코드
  // await prisma.user.update({
  //   where: {
  //     id: userId,
  //   },
  //   data: {
  //     fcm_token: null,
  //   },
  // });
};

const userService = {
  signInKakao,
  verifyIdentityToken,
  getApplePublicKey,
  getUser,
  patchUserEverRecorded,
  patchUserPhotoAndNickName,
  patchUserNickName,
  deleteUser,
  updateFcmToken,
  signOut,
};

export default userService;
