import { Router } from 'express';
import { familyController } from '../controller';
import auth from '../middleware/auth';
const router: Router = Router();

//? GET family
router.get('/', auth, familyController.getUserFamily);

//? GET family/mypage
router.get('/mypage', familyController.getMypage);

//? GET family/code/:familyId
router.get('/code/:familyId', familyController.getFamilyCode);

export default router;
