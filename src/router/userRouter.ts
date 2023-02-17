import { Router } from 'express';
import userController from '../controller/userController';
import { auth } from '../middleware';
import upload from '../middleware/upload';
const router: Router = Router();

router.post('/kakao/signin', userController.signInKakao);
router.post('/apple/signin', userController.signInApple);

router.patch(
  '/profile',
  upload.single('file'),
  auth,
  userController.patchUserProfile
);
router.delete('/', auth, userController.deleteUser);

export default router;
