import { Request, Response } from 'express';
import { rm, sc } from '../constants';
import { fail, success } from '../constants/response';
import { CommentResponseDto } from '../interface/comment/CommentResponseDto';
import commentService from '../service/commentService';

//? 일반 댓글 작성하기
const createComment = async (req: Request, res: Response) => {
  try {
    const userId: number = req.body.userId;

    const recordId = req.params.recordId;
    const { content } = req.body;

    const data: CommentResponseDto[] = await commentService.createComment(
      1,
      +recordId,
      content
    );

    return res
      .status(sc.CREATED)
      .send(success(sc.CREATED, rm.CREATE_COMMENT_SUCCESS, data));
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

//? 이모지 댓글 작성하기
const createEmojiComment = async (req: Request, res: Response) => {
  try {
    const userId: number = req.body.userId;

    const recordId = req.params.recordId;
    const { emoji } = req.body;

    const data: CommentResponseDto[] = await commentService.createEmojiComment(
      1,
      +recordId,
      emoji
    );

    return res
      .status(sc.CREATED)
      .send(success(sc.CREATED, rm.CREATE_COMMENT_SUCCESS, data));
  } catch (error) {
    console.log(error);
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
