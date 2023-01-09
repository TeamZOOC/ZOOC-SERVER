import { CommentResponseDto } from './../interface/comment/CommentResponseDto';
import { PrismaClient } from '@prisma/client';
import { CommentResponseDto } from '../interface/comment/CommentResponseDto';

const prisma = new PrismaClient();

const createComment = async (
  userId: number,
  recordId: number,
  content: string
): Promise<CommentResponseDto[]> => {
  const comment = await prisma.comment.create({
    data: {
      content: content,
      user: {
        connect: {
          id: userId,
        },
      },
      record: {
        connect: {
          id: recordId,
        },
      },
    },
  });

  const comments = await prisma.comment.findMany();
  const recentComments: CommentResponseDto[] = [];

  const promises = comments.map(async (comment) => {
    const commentWriter = await prisma.user.findUnique({
      where: {
        id: comment.writer,
      },
    });
    if (!commentWriter) throw new Error('no comment writer');

    const comment: CommentResponseDto = {
      nickName: commentWriter.nick_name,
      photo: commentWriter.photo,
      content: comment.content,
      emoji: comment.emoji,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
    };

    recentComments.push(comment);
  });
  await Promise.all(promises);

  return recentComments;
};

const commentService = {
  createComment,
};

export default commentService;
