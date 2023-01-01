import { UserDto } from '../user/UserDto';
import { PetDto } from './PetDto';

export interface MypageResponseDto {
  user: UserDto;
  familyMember: UserDto[];
  pet: PetDto[];
}
