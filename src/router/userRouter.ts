import { Router } from 'express';
import { body } from 'express-validator';
import userController from '../controller/userController';
import { auth } from '../middleware';
import upload from '../middleware/upload';
const router: Router = Router();

router.post('/kakao/signin', userController.signInKakao);
router.post(
  '/apple/signin',
  [body('identityTokenString').notEmpty()],
  userController.signInApple
);

router.patch(
  '/profile',
  upload.single('file'),
  auth,
  userController.patchUserProfile
);
router.delete('/', auth, userController.deleteUser);

router.put(
  '/fcm_token',
  [body('fcmToken').notEmpty().isString()],
  auth,
  userController.updateFcmToken
);

router.delete(
  '/signout',
  [body('fcmToken').notEmpty().isString()],
  auth,
  userController.signOut
);

export default router;
