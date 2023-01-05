import { Router } from 'express';
import { familyController } from '../controller';
const router: Router = Router();

//? GET family
router.get('/', familyController.getUserFamily);

//? GET family/mypage
router.get('/mypage', familyController.getMypage);

//? GET family/code/:familyId
router.get('/code/:familyId', familyController.getFamilyCode);

export default router;
