import { Router } from 'express';
import familyRouter from './familyRouter';
const router: Router = Router();

router.use('/family', familyRouter);
export default router;
