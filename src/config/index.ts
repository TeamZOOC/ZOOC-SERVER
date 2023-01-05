import dotenv from 'dotenv';

const envFound = dotenv.config();

if (envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  //? 데이터베이스
  database: process.env.DATABASE_URL as string,

  //? S3
  s3AccessKey: process.env.S3_ACCESS_KEY as string,
  s3SecretKey: process.env.S3_SECRET_KEY as string,
  bucketName: process.env.S3_BUCKET as string,

  //?로그인
  KAKAO_ID: process.env.KAKAO_ID as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
};
