import { Router } from 'express';
import userController from '../controller/userController';
const router: Router = Router();

router.post('/kakao/signin', userController.signInKakao);

export default router;
