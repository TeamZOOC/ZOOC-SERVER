import { CommentDto } from '../comment/CommentDto';
import { RecordDto } from './RecordDto';

export interface RecordResponseDto {
  leftId: number;
  rightId: number;
  record: RecordDto;
  comments: CommentDto[];
}
