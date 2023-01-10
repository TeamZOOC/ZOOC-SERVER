export interface CommentDto {
  isEmoji: boolean;
  nickName: string;
  photo: string | null;
  content: string | null;
  emoji: string | null;
  date: string;
}
