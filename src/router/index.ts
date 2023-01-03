import { Router } from 'express';
import userRouter from './userRouter';
import familyRouter from './familyRouter';
const router: Router = Router();

router.use('/auth', userRouter);
router.use('/family', familyRouter);

export default router;
