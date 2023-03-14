export interface CommentDto {
  commentId: number;
  isEmoji: boolean;
  writerId: number;
  nickName: string;
  photo: string | null;
  content: string | null;
  emoji: number | null;
  date: string;
  isMyComment: boolean;
}
