export interface CommentResponseDto {
  nickName: string;
  photo: string | null;
  content: string | null;
  emoji: number | null;
  createdAt: Date;
  updatedAt: Date;
}
