import { CommentResponseDto } from './../interface/comment/CommentResponseDto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//? 일반 댓글 작성
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
  if (!content) throw new Error('no content');

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

//? 이모지 댓글 작성
const createEmojiComment = async (
  userId: number,
  recordId: number,
  emoji: number
): Promise<CommentResponseDto[]> => {
  const record = await prisma.record.findFirst({
    where: {
      id: recordId,
    },
  });
  if (!record) throw new Error('no record');
  if (!emoji) throw new Error('no emoji');

  await prisma.comment.create({
    data: {
      emoji: emoji,
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

const deleteComment = async (commentId: number): Promise<void> => {
  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
};

const commentService = {
  createComment,
  createEmojiComment,
  deleteComment,
};

export default commentService;
