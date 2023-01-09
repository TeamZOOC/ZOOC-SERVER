import { Router } from 'express';
import userRouter from './userRouter';
import familyRouter from './familyRouter';
import recordRouter from './recordRouter';
import { auth } from '../middleware';
import alarmRouter from './alarmRouter';
const router: Router = Router();

router.use('/user', userRouter);
router.use('/family', auth, familyRouter);
router.use('/record', recordRouter);
router.use('/alarm', alarmRouter);

export default router;
