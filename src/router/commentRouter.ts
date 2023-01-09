import { Router } from 'express';
import commentController from '../controller/commentController';
import userController from '../controller/userController';
const router: Router = Router();

//? POST comment/{recordId}
router.post('/:recordId', commentController.createComment);

export default router;
