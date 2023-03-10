import { CommentDto } from '../comment/CommentDto';
import { RecordDto } from './RecordDto';

export interface RecordResponseDto {
  leftId: number | null;
  rightId: number | null;
  userId: number;
  record: RecordDto;
  comments: CommentDto[];
}
