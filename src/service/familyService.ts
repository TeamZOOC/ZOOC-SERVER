import { PetDto } from './../interface/family/PetDto';
import { FamilyDto } from './../interface/family/FamilyDto';
import { MypageResponseDto } from './../interface/family/MypageResponseDto';
import { PrismaClient } from '@prisma/client';
import { UserDto } from '../interface/user/UserDto';
const prisma = new PrismaClient();

//~ 사용자의 전체 가족 정보 조회
const getUserFamily = async (userId: number): Promise<FamilyDto[]> => {
  const families: FamilyDto[] | null = await prisma.family.findMany({
    where: {
      user_family: {
        some: {
          user_id: userId,
        },
      },
    },
  });
  if (!families) throw new Error('no family');

  return families;
};

//~ 특정 가족 정보 조회
const getFamilyById = async (familyId: number): Promise<FamilyDto> => {
  const family: FamilyDto | null = await prisma.family.findUnique({
    where: {
      id: familyId,
    },
  });
  if (!family) throw new Error('no family');

  return family;
};

//~ 가족 멤버 조회
const getFamilyMembers = async (familyId: number): Promise<UserDto[]> => {
  const users: UserDto[] = await prisma.user.findMany({
    where: {
      user_family: {
        some: {
          family_id: familyId,
        },
      },
    },
    select: {
      id: true,
      nick_name: true,
      photo: true,
    },
  });

  return users;
};

//~ 가족 반려동물 조회
const getFamilyPets = async (familyId: number): Promise<PetDto[]> => {
  const pets: PetDto[] = await prisma.pet.findMany({
    where: {
      family_id: familyId,
    },
    select: {
      id: true,
      name: true,
      photo: true,
    },
  });

  return pets;
};

//~ 마이페이지 정보 리턴
const getMypage = async (userId: number): Promise<MypageResponseDto> => {
  const families: FamilyDto[] = await getUserFamily(userId);
  const familyMembers: UserDto[] = await getFamilyMembers(families[0].id);
  const familyPets: PetDto[] = await getFamilyPets(families[0].id);

  const data: MypageResponseDto = {
    user: {
      id: userId,
      nick_name: '복실맘',
      photo: 'url',
    },
    familyMember: familyMembers,
    pet: familyPets,
  };
  return data;
};

const familyService = {
  getUserFamily,
  getMypage,
  getFamilyById,
};

export default familyService;
