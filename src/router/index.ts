import { Router } from 'express';
import userRouter from './userRouter';
import familyRouter from './familyRouter';
import recordRouter from './recordRouter';
import commentRouter from './commentRouter';
import { auth } from '../middleware';
const router: Router = Router();

router.use('/user', userRouter);
router.use('/family', auth, familyRouter);
router.use('/record', recordRouter);
router.use('/comment', commentRouter);

export default router;
