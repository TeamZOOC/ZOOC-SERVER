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
      id: user.id,
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

  if (!user) {
    const jwtToken = await signUp(kakaoId);
    return jwtToken;
  }
  const userId = user.id;
  const payload = {
    userId,
  };
  const jwtToken = jwtHandler.sign(payload);
  return jwtToken;
};

const userService = {
  signInKakao,
};

export default userService;
