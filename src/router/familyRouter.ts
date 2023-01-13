import { Router } from 'express';
import { familyController } from '../controller';
import auth from '../middleware/auth';
import { upload } from '../middleware';
const router: Router = Router();

//? GET family
router.get('/', familyController.getUserFamily);

//? POST family
router.post('/', upload.array('files'), auth, familyController.createFamily);

//? GET family/mypage
router.get('/mypage', familyController.getMypage);

//? GET family/code/:familyId
router.get('/code/:familyId', familyController.getFamilyCode);

//? POST family/pets/:familyId
router.post(
  '/pets/:familyId',
  upload.array('files'),
  auth,
  familyController.createPets
);

//? POST family/pet/:familyId
router.post(
  '/pet/:familyId',
  upload.single('file'),
  auth,
  familyController.createPet
);

//? POST family/user
router.post('/user', familyController.enrollUserToFamily);

export default router;
