import { CommentResponseDto } from './../interface/comment/CommentResponseDto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createComment = async (
  userId: number,
  recordId: number,
  content: string
): Promise<CommentResponseDto[]> => {
  const record = await prisma.record.findFirst({
    where: {
      id: recordId,
    },
  });
  if (!record) throw new Error('no record');

  await prisma.comment.create({
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
    const writer = await prisma.user.findUnique({
      where: {
        id: comment.writer,
      },
    });
    if (!writer) throw new Error('no comment writer');

    const data: CommentResponseDto = {
      nickName: writer.nick_name,
      photo: writer.photo,
      content: comment.content,
      emoji: comment.emoji,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
    };

    recentComments.push(data);
  });
  await Promise.all(promises);

  return recentComments;
};

const commentService = {
  createComment,
};

export default commentService;
