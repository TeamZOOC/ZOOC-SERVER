export interface CommentDto {
  isEmoji: boolean;
  nickName: string;
  photo: string | null;
  content: string | null;
  emoji: number | null;
  date: string;
}
