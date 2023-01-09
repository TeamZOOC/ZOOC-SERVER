import { Router } from 'express';
import userController from '../controller/userController';
import { auth } from '../middleware';
import upload from '../middleware/upload';
const router: Router = Router();

router.post('/kakao/signin', userController.signInKakao);
router.patch(
  '/profile',
  upload.single('file'),
  auth,
  userController.patchUserProfile
);

export default router;
