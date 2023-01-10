import { RecordDto } from './RecordDto';

export interface RecordPreviewResponseDto {
  record: RecordDto;
  commentWriterPhotos: string[];
}
