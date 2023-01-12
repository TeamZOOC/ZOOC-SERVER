import { Router } from 'express';
import { recordController } from '../controller';
import { upload } from '../middleware';

const router: Router = Router();

//? GET record/mission/{familyId}
router.get('/mission/:familyId', recordController.getMission);

//? GET record/pet/{familyId}
router.get('/pet/:familyId', recordController.getAllPet);

//? DELETE record/{recordId}
router.delete('/:recordId', recordController.deleteRecord);

//? POST record/{familyId}?missionId=
router.post('/:familyId', upload.single('file'), recordController.createRecord);

//? GET record/{familyId}/{recordId}
router.get('/:familyId/:recordId', recordController.getRecord);

//? GET record/{familyId}/{petId}
router.get('/:familyId', recordController.getAllRecord);

//? GET record/aos/{familyId}/{petId}
router.get('/aos/:familyId', recordController.getAllRecordAos);

export default router;
