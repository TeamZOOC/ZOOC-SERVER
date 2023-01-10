import { UserDto } from './../user/UserDto';
export interface AlarmListResponseDto {
  writer: UserDto;
  created_time: Date;
}
