import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import { CommentDto } from '../interface/comment/CommentDto';

const prisma = new PrismaClient();

const getAllComment = async (recordId: number): Promise<CommentDto[]> => {
  const comments = await prisma.comment.findMany({
    where: {
      record_id: recordId,
    },
    orderBy: {
      created_at: 'asc',
    },
  });
  const recentComments: CommentDto[] = [];

  const promises = comments.map(async (comment) => {
    const writer = await prisma.user.findUnique({
      where: {
        id: comment.writer,
      },
    });
    if (!writer) throw new Error('no comment writer');

    const isEmoji = comment.emoji || comment.emoji === 0 ? true : false;

    const commentDate = dayjs(comment.created_at).format('M월 D일');

    const data: CommentDto = {
      isEmoji: isEmoji,
      writerId: writer.id,
      nickName: writer.nick_name,
      photo: writer.photo,
      content: comment.content,
      emoji: comment.emoji,
      date: commentDate,
    };

    recentComments.push(data);
  });
  await Promise.all(promises);

  return recentComments;
};

//? 일반 댓글 작성
const createComment = async (
  userId: number,
  recordId: number,
  content: string
): Promise<CommentDto[]> => {
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
  return getAllComment(recordId);
};

//? 이모지 댓글 작성
const createEmojiComment = async (
  userId: number,
  recordId: number,
  emoji: number
): Promise<CommentDto[]> => {
  const record = await prisma.record.findFirst({
    where: {
      id: recordId,
    },
  });
  if (!record) throw new Error('no record');
  if (emoji !== 0 && !emoji) throw new Error('no emoji');

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
  return getAllComment(recordId);
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
  getAllComment,
};

export default commentService;
