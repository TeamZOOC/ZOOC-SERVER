import { Router } from 'express';
import alarmController from '../controller/alarmController';
const router: Router = Router();

//? GET alarm/list
router.get('/list', alarmController.getAlarmList);

export default router;
