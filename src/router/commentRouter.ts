import { Router } from 'express';
import { body, param } from 'express-validator';
import commentController from '../controller/commentController';
const router: Router = Router();

//? POST comment/{recordId}
router.post(
  '/:recordId',
  [param('recordId').notEmpty(), body('content').notEmpty()],
  commentController.createComment
);

//? POST comment/emoji/{recordId}
router.post(
  '/emoji/:recordId',
  [param('recordId').notEmpty(), body('emoji').notEmpty()],
  commentController.createEmojiComment
);

//? DELETE comment/{commentId}
router.delete('/:commentId', commentController.deleteComment);

export default router;
