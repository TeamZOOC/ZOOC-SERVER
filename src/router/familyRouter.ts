import { Router } from 'express';
import { familyController } from '../controller';
import { upload } from '../middleware';
const router: Router = Router();

//? GET family
router.get('/', familyController.getUserFamily);

//? GET family/mypage
router.get('/mypage', familyController.getMypage);

//? GET family/code/:familyId
router.get('/code/:familyId', familyController.getFamilyCode);

//? POST family/pet/:familyId
router.post(
  '/pet/:familyId',
  upload.single('file'),
  familyController.createPet
);

export default router;
