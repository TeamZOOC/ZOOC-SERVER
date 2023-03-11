import admin from 'firebase-admin';
import { MulticastMessage } from 'firebase-admin/lib/messaging/messaging-api';
import config from '../config';

const firebaseKey = {
  // type: config.fcmType,
  // project_id: config.fcmProjectId,
  // private_key_id: config.fcmPrivateKeyId,
  // private_key: config.fcmPrivateKey,
  // client_email: config.fcmClientEmail,
  // client_id: config.fcmClientId,
  // auth_uri: config.fcmAuthUrl,
  // token_uri: config.fcmTokenUri,
  // auth_provider_x509_cert_url: config.fcmAuthProviderX509CertUrl,
  // client_x509_cert_url: config.fcmClientX509CertUrl,
  type: config.fcmPrivateKey.type,
  project_id: config.fcmPrivateKey.project_id,
  private_key_id: config.fcmPrivateKey.private_key_id,
  private_key: config.fcmPrivateKey.private_key,
  client_email: config.fcmPrivateKey.client_email,
  client_id: config.fcmPrivateKey.client_id,
  auth_uri: config.fcmPrivateKey.auth_uri,
  token_uri: config.fcmPrivateKey.token_uri,
  auth_provider_x509_cert_url: config.fcmPrivateKey.auth_provider_x509_cert_url,
  client_x509_cert_url: config.fcmPrivateKey.client_x509_cert_url,
} as admin.ServiceAccount;

const app = admin.initializeApp({
  credential: admin.credential.cert(firebaseKey),
});

//? 푸시 알림 여러개 전송하는 함수
const sendPushAlarm = async (messages: MulticastMessage) => {
  app
    .messaging()
    .sendMulticast(messages)
    .then((res) => {
      if (res.failureCount > 0) {
        console.log('error를 발생시킨 토큰:');
        res.responses.forEach((resp, index) => {
          if (!resp.success) {
            console.log(`${messages.tokens[index]}`);
          }
        });
      }
    });
  //이 에러 캐치는 호출 쪽에서 하자
  // .catch((err) => console.error('error', err));
};

export default sendPushAlarm;
