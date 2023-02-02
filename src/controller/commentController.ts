import { Request, Response } from 'express';
import { rm, sc } from '../constants';
import { fail, success } from '../constants/response';
import { CommentDto } from '../interface/comment/CommentDto';
import webhook from '../modules/test-message';
import commentService from '../service/commentService';

//? 일반 댓글 작성하기
const createComment = async (req: Request, res: Response) => {
  const userId: number = req.body.userId;
  try {
    const recordId = req.params.recordId;
    const { content } = req.body;

    const data: CommentDto[] = await commentService.createComment(
      userId,
      +recordId,
      content
    );

    return res
      .status(sc.CREATED)
      .send(success(sc.CREATED, rm.CREATE_COMMENT_SUCCESS, data));
  } catch (error) {
    console.log(error);
    const errorMessage = webhook.slackMessage(
      req.method,
      req.url,
      error,
      userId
    );
    webhook.sendWebhook(errorMessage);

    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

//? 이모지 댓글 작성하기
const createEmojiComment = async (req: Request, res: Response) => {
  const userId: number = req.body.userId;
  try {
    const recordId = req.params.recordId;
    const { emoji } = req.body;

    const data: CommentDto[] = await commentService.createEmojiComment(
      userId,
      +recordId,
      emoji
    );

    return res
      .status(sc.CREATED)
      .send(success(sc.CREATED, rm.CREATE_EMOJI_COMMENT_SUCCESS, data));
  } catch (error) {
    console.log(error);
    const errorMessage = webhook.slackMessage(
      req.method,
      req.url,
      error,
      userId
    );
    webhook.sendWebhook(errorMessage);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

//? 댓글 삭제하기
const deleteComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;

  await commentService.deleteComment(+commentId);
  return res.status(sc.OK).send(success(sc.OK, rm.DELETE_COMMENT_SUCCESS));
};

const commentController = {
  createComment,
  createEmojiComment,
  deleteComment,
};

export default commentController;
