import { Router } from 'express';
import { recordController } from '../controller';

const router: Router = Router();

//? GET record/mission/{familyId}
router.get('/mission/:familyId', recordController.getMission);

//? GET record/pet/{familyId}
router.get('/pet/:familyId', recordController.getAllPet);

//? POST record/{familyId}
router.post('/:familyId', recordController.createRecord);

export default router;
