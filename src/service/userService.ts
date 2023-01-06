import { UserDto } from './../interface/user/UserDto';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import jwtHandler from '../modules/jwtHandler';
const prisma = new PrismaClient();

const signUp = async (kakaoId: bigint) => {
  const user = await prisma.user.create({
    data: {
      social_id: kakaoId,
      provider: 'kakao',
      photo: null,
      nick_name: '',
      fcm_token: '',
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

const signInKakao = async (kakaoToken: string | undefined) => {
  const result = await axios.get('https://kapi.kakao.com/v2/user/me', {
    headers: {
      Authorization: `Bearer ${kakaoToken}`,
    },
  });
  const { data } = result;
  const kakaoId: bigint = data.id;

  if (!kakaoId) throw new Error('KEY_ERROR');

  const user = await prisma.user.findUnique({
    where: {
      social_id: kakaoId,
    },
  });

  //유저 없으면 회원가입
  if (!user) {
    const jwtToken = await signUp(kakaoId);
    return jwtToken;
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

  return jwtToken;
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

//~ 사용자 프로필 사진 & 닉네임 수정하기
const patchUserPhotoAndNickName = async (
  userId: number,
  photo: string,
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
  });

  return user;
  // 프로필 사진 및 닉네임 변경
  // 닉네임만 변경
};
const userService = {
  signInKakao,
  getUser,
  patchUserPhotoAndNickName,
};

export default userService;
