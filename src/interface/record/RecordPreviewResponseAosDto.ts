import { CommentDto } from './../comment/CommentDto';
import { RecordDto } from './RecordDto';

export interface RecordPreviewResponseAosDto {
  record: RecordDto;
  comments: CommentDto[];
}
