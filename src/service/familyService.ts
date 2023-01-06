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

//~ 가족에 반려동물 등록하기
const createPet = async (
  name: string,
  photo: string,
  familyId: number
): Promise<PetDto> => {
  const data: PetDto = await prisma.pet.create({
    data: {
      name: name,
      photo: photo,
      family: {
        connect: {
          id: familyId,
        },
      },
    },
  });

  return data;
};

//~ 입력한 가족 코드에 해당하는 가족 정보 불러오기
const searchFamilyByCode = async (code: string) => {
  const family: FamilyDto | null = await prisma.family.findUnique({
    where: {
      code: code,
    },
  });

  return family;
};

//~ 가족에 유저 등록하기
const enrollUsertoFamily = async (userId: number, code: string) => {
  // 입력한 가족 코드에 해당하는 가족 정보 불러오기
  const family = await searchFamilyByCode(code);

  //코드에 해당하는 가족 없으면 throw error
  if (!family) throw new Error('no family');

  // 해당 코드를 갖는 가족 정보가 있으면?
  // 이미 등록 됐으면 throw error
  const user_family = await prisma.user_family.findFirst({
    where: {
      user_id: userId,
      family_id: family.id,
    },
  });
  if (user_family) throw new Error('already family');

  // 명 수 세기
  const familyMembers = await getFamilyMembers(family.id);
  // 8명 미만이면 유저 등록
  if (familyMembers.length < 8) {
    // 유저 등록
    const data = await prisma.user_family.create({
      data: {
        user_id: userId,
        family_id: family.id,
      },
    });
    return data;
  }
  //유저 8명 이상이면 throw error
  throw new Error('full family');
};

const familyService = {
  getUserFamily,
  getMypage,
  getFamilyPets,
  getFamilyById,
  createPet,
  enrollUsertoFamily,
};

export default familyService;
