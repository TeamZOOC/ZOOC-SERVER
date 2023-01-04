// src/modules/jwtHandler.ts
import jwt from 'jsonwebtoken';
import config from '../config';
import tokenType from '../constants/tokenType';

//* 받아온 userId, socialId를 담는 jwt token 생성
const sign = (userId: number, socialId: bigint) => {
  const payload = {
    userId,
    socialId,
  };

  const jwtToken = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '7d' });
  return jwtToken;
};

//* token 검사!
const verify = (token: string) => {
  let decoded: string | jwt.JwtPayload;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error: any) {
    if (error.message === 'jwt expired') {
      return tokenType.TOKEN_EXPIRED;
    } else if (error.message === 'invalid token') {
      return tokenType.TOKEN_INVALID;
    } else {
      return tokenType.TOKEN_INVALID;
    }
  }

  return decoded;
};

export default {
  sign,
  verify,
};
