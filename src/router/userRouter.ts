import { Router } from 'express';
import userController from '../controller/userController';
import upload from '../middleware/upload';
const router: Router = Router();

router.post('/kakao/signin', userController.signInKakao);
router.post('/profile', upload.single('file'), userController.patchUserProfile);

export default router;
