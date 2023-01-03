import { Router } from 'express';
import { familyController } from '../controller';
const router: Router = Router();

//? GET family/
router.get('/', familyController.getMypage);

export default router;
