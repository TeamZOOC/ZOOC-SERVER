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

router.post('/refresh', userController.refreshToken);

router.patch(
  '/profile',
  upload.single('file'),
  auth,
  userController.patchUserProfile
);
router.delete('/', auth, userController.deleteUser);

export default router;
