import { RecordDto } from './RecordDto';

export interface RecordPreviewResponseDto {
  record: RecordDto;
  commentWriters: CommentWriterDto[];
}

export interface CommentWriterDto {
  writerId: number;
  writerPhoto: string | null;
}
