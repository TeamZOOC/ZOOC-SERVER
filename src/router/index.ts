import { Router } from 'express';
import userRouter from './userRouter';
import familyRouter from './familyRouter';
import RecordRouter from './RecordRouter';
const router: Router = Router();

router.use('/user', userRouter);
router.use('/family', familyRouter);
router.use('/record', RecordRouter);

export default router;
