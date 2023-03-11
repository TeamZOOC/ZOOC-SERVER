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
  TEST_TOKEN: process.env.TEST_TOKEN as string,

  //? 슬랙 웹훅
  SLACK_WEBHOOK_URI: process.env.SLACK_WEBHOOK_URI as string,

  //? FCM
  fcmType: process.env.TYPE as string,
  fcmProjectId: process.env.PROJECT_ID as string,
  fcmPrivateKeyId: process.env.PRIVATE_KEY_ID as string,
  fcmPrivateKey: process.env.PRIVATE_KEY
    ? JSON.parse(process.env.PRIVATE_KEY)
    : undefined,

  fcmClientEmail: process.env.CLIENT_EMAIL as string,
  fcmClientId: process.env.CLIENT_ID as string,
  fcmAuthUrl: process.env.AUTH_URL as string,
  fcmTokenUri: process.env.TOKEN_URI as string,
  fcmAuthProviderX509CertUrl: process.env.AUTH_PROVIDER_X509_CERT_URL as string,
  fcmClientX509CertUrl: process.env.CLIENT_X509_CERT_URL as string,
};
