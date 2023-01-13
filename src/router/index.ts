import { Router } from 'express';
import userRouter from './userRouter';
import familyRouter from './familyRouter';
import recordRouter from './recordRouter';
import commentRouter from './commentRouter';
import { auth } from '../middleware';
import alarmRouter from './alarmRouter';
const router: Router = Router();

router.use('/user', userRouter);
router.use('/family', auth, familyRouter);
router.use('/record', auth, recordRouter);
router.use('/alarm', auth, alarmRouter);
router.use('/comment', auth, commentRouter);

export default router;
