import { RecordDto } from './RecordDto';

export interface RecordPreviewResponseDto {
  record: RecordDto;
  commentWriters: commentWriterDto[];
}

interface commentWriterDto {
  writerId: number;
  writerphoto: string | null;
}
