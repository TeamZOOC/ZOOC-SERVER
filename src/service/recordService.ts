import { PrismaClient } from '@prisma/client';
import _ from 'lodash';
import { PetDto } from '../interface/family/PetDto';
import { MissionDto } from '../interface/record/MissionDto';
import familyService from './familyService';
const prisma = new PrismaClient();

const getMission = async (
  userId: number,
  familyId: number
): Promise<MissionDto[]> => {
  //미션 id들 가져오기
  const missionIds = await prisma.mission.findMany({
    select: {
      id: true,
    },
  });

  const missionIdList: number[] = [];

  missionIds.map((missionId) => {
    missionIdList.push(missionId.id);
  });

  //내가 작성한 거 중에 미션인 것의 missionid
  const completedMissionIds = await prisma.record.findMany({
    where: {
      writer: userId,
      family_id: familyId,
      NOT: { mission_id: null },
    },
    select: {
      mission_id: true,
    },
  });

  const completedMissionIdList: number[] = [];
  completedMissionIds.map((missionId) => {
    if (typeof missionId.mission_id === 'number') {
      completedMissionIdList.push(missionId.mission_id);
    }
  });

  const unCompletedMissionIds = _.difference(
    missionIdList,
    completedMissionIdList
  );

  const unCompletedMissionList: MissionDto[] = [];
  // 아직 수행하지 않은 미션 ids
  const promises = unCompletedMissionIds.map(async (unCompletedMissionId) => {
    const unCompletedMission: MissionDto | null =
      await prisma.mission.findUnique({
        where: {
          id: unCompletedMissionId,
        },
      });

    if (unCompletedMission) {
      unCompletedMissionList.push(unCompletedMission);
    }
  });

  await Promise.all(promises);
  return unCompletedMissionList;
};

const getAllPet = async (familyId: number): Promise<PetDto[]> => {
  return familyService.getFamilyPets(familyId);
};

const deleteRecord = async (recordId: number): Promise<void> => {
  await prisma.record.delete({
    where: {
      id: recordId,
    },
  });
};

const recordService = {
  getMission,
  getAllPet,
  deleteRecord,
};

export default recordService;
