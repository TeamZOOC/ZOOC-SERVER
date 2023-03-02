import admin from 'firebase-admin';
import { MulticastMessage } from 'firebase-admin/lib/messaging/messaging-api';
import config from '../config';

const firebaseKey = {
  type: config.fcmType,
  projectId: config.fcmProjectId,
  privateKeyId: config.fcmPrivateKeyId,
  privateKey: config.fcmPrivateKey,
  clientEmail: config.fcmClientEmail,
  clientId: config.fcmClientId,
  authUri: config.fcmAuthUrl,
  tokenUri: config.fcmTokenUri,
  authProviderX509CertUrl: config.fcmAuthProviderX509CertUrl,
  clientX509CertUrl: config.fcmClientX509CertUrl,
};

const app = admin.initializeApp({
  credential: admin.credential.cert(firebaseKey),
});

//? 푸시 알림 여러개 전송하는 함수
const sendPushAlarm = async (messages: MulticastMessage) => {
  app
    .messaging()
    .sendMulticast(messages)
    .then((res) => console.log('success', res));
  //이 에러 캐치는 호출 쪽에서 하자
  // .catch((err) => console.error('error', err));
};

export default sendPushAlarm;
