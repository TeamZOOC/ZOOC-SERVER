import { Router } from 'express';
import { recordController } from '../controller';
import { upload } from '../middleware';

const router: Router = Router();

//? GET record/mission/{familyId}
router.get('/mission/:familyId', recordController.getMission);

//? GET record/pet/{familyId}
router.get('/pet/:familyId', recordController.getAllPet);

//? POST record/{familyId}
router.post('/:familyId', upload.single('file'), recordController.createRecord);

export default router;
