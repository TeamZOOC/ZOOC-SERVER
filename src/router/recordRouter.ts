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

//? GET record/:recordId
router.get('/:recordId', recordController.getRecord);

//? GET record/:family
//router.get('/:familyId', recordController.getAllRecord);

export default router;
