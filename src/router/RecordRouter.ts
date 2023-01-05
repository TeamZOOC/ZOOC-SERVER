import { Router } from 'express';
import RecordController from '../controller/RecordController';

const router: Router = Router();

//? GET record/mission
router.get('/mission', RecordController.getMission);

export default router;
