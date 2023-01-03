import { Router } from 'express';
import { familyController } from '../controller';
const router: Router = Router();

//? GET family/
router.get('/', familyController.getMypage);

//? GET family/code/
router.get('/code', familyController.getFamilyCode);

export default router;
