import { Router } from 'express';
import { recordController } from '../controller';

const router: Router = Router();

//? GET record/mission
router.get('/mission/:familyId', recordController.getMission);

export default router;
