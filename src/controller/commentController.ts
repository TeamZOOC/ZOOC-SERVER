import { Request, Response } from 'express';
import { rm, sc } from '../constants';
import { fail, success } from '../constants/response';
import { CommentResponseDto } from '../interface/comment/CommentResponseDto';
import commentService from '../service/commentService';

const createComment = async (req: Request, res: Response) => {
  try {
    const userId: number = req.body.userId;

    const recordId = req.params.recordId;
    const { content } = req.body;

    const data: CommentResponseDto[] = await commentService.createComment(
      userId,
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

const commentController = {
  createComment,
};
export default commentController;
