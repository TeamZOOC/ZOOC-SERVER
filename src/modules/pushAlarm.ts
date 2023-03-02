import admin from 'firebase-admin';
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
