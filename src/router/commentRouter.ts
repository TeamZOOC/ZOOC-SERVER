import { Router } from 'express';
import commentController from '../controller/commentController';
const router: Router = Router();

//? POST comment/{recordId}
router.post('/:recordId', commentController.createComment);

//? POST comment/emoji/{recordId}
router.post('/emoji/:recordId', commentController.createEmojiComment);

//? DELETE comment/{commentId}
router.delete('/:commentId', commentController.deleteComment);

export default router;
