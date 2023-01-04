import axios from 'axios';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const signUp = async (kakaoId: bigint, jwtToken: string) => {
  await prisma.user.create({
    data: {
      social_id: kakaoId,
      provider: 'kakao',
      photo: '',
      nick_name: '',
      fcm_token: '',
      jwt_token: jwtToken,
    },
  });
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

  const jwtToken = jwt.sign(
    { kakoId: kakaoId },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );

  if (!user) {
    await signUp(kakaoId, jwtToken);
  }

  return jwtToken;
};

const userService = {
  signInKakao,
};

export default userService;
