import { Router } from 'express';
const router: Router = Router();

router.post('/kakao/signin', userController.signInKakao);

export default router;
