import { Router } from 'express';
import { body, param } from 'express-validator';
import commentController from '../controller/commentController';
const router: Router = Router();

//? POST comment/{recordId}
router.post(
  '/:recordId',
  [param('recordId').isNumeric(), body('content').trim().notEmpty()],
  commentController.createComment
);

//? POST comment/emoji/{recordId}
router.post(
  '/emoji/:recordId',
  [param('recordId').isNumeric(), body('emoji').trim().notEmpty()],
  commentController.createEmojiComment
);

//? DELETE comment/{commentId}
router.delete(
  '/:commentId',
  [param('commentId').isNumeric()],
  commentController.deleteComment
);

export default router;
