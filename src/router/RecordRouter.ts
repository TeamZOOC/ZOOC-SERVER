import { Router } from 'express';

const router: Router = Router();

//? GET record/mission
router.get('/mission', RecordController.getMission);

export default router;
