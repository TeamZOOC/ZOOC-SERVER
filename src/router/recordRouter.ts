import { Router } from 'express';
import { recordController } from '../controller';
import { auth, upload } from '../middleware';

const router: Router = Router();

//? GET record/mission/{familyId}
router.get('/mission/:familyId', recordController.getMission);

//? GET record/pet/{familyId}
router.get('/pet/:familyId', recordController.getAllPet);

//? DELETE record/{recordId}
router.delete('/:recordId', recordController.deleteRecord);

//? POST record/{familyId}?missionId=
router.post(
  '/:familyId',
  upload.single('file'),
  auth,
  recordController.createRecord
);

//? GET record/detail/{familyId}/{recordId}
router.get('/detail/:familyId/:recordId', recordController.getRecord);

//? GET record/{familyId}/{petId}
router.get('/:familyId/:petId', recordController.getAllRecord);

//? GET record/aos/{familyId}/{petId}
router.get('/aos/:familyId/:petId', recordController.getAllRecordAos);

export default router;
