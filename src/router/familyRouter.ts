import { Router } from 'express';
import { familyController } from '../controller';
import auth from '../middleware/auth';
import { upload } from '../middleware';
const router: Router = Router();

//? GET family
router.get('/', familyController.getUserFamily);

//? POST family
router.post('/', familyController.createFamily);

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

//? POST family/user
router.post('/user', auth, familyController.enrollUserToFamily);

export default router;
