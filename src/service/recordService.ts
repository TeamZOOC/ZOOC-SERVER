import {
  CommentWriterDto,
  RecordPreviewResponseDto,
} from './../interface/record/RecordPreviewResponseDto';
import { RecordResponseDto } from '../interface/record/RecordResponseDto';
import { RecordDto } from './../interface/record/RecordDto';
import { PrismaClient, record } from '@prisma/client';
import _ from 'lodash';
import { PetDto } from '../interface/family/PetDto';
import { MissionDto } from '../interface/record/MissionDto';
import { UserDto } from '../interface/user/UserDto';
import familyService from './familyService';
const prisma = new PrismaClient();
import dayjs from 'dayjs';
import { CommentDto } from '../interface/comment/CommentDto';
import commentService from './commentService';
import { RecordPreviewResponseAosDto } from '../interface/record/RecordPreviewResponseAosDto';
import sendPushAlarm from '../modules/pushAlarm';
import userService from './userService';

//* 완료되지 않은 미션 조회
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

//* 펫 전제조회
const getAllPet = async (familyId: number): Promise<PetDto[]> => {
  return familyService.getFamilyPets(familyId);
};

//* 기록 삭제하기
const deleteRecord = async (recordId: number): Promise<void> => {
  await prisma.record.delete({
    where: {
      id: recordId,
    },
  });
};

//* 기록 작성하기
const createRecord = async (
  userId: number,
  familyId: number,
  location: string,
  content: string,
  pet: number[],
  missionId: number | undefined
): Promise<void> => {
  let recordId: number;

  //~ 유저가 기록을 한 적이 있는지 불러오기
  const userNickNameAndEverRecordedInfo = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      nick_name: true,
      ever_recorded: true,
    },
  });

  if (!userNickNameAndEverRecordedInfo) throw new Error('no User');

  //* 일반 기록
  if (missionId === undefined) {
    const record = await prisma.record.create({
      data: {
        content: content,
        photo: location,
        user: {
          connect: {
            id: userId,
          },
        },
        family: {
          connect: {
            id: familyId,
          },
        },
      },
    });
    recordId = record.id;
  } else {
    //* 미션 기록
    const missionRecord = await prisma.record.findFirst({
      where: {
        mission_id: missionId,
      },
    });

    if (missionRecord) throw new Error('same mission record exist');

    const record = await prisma.record.create({
      data: {
        content: content,
        photo: location,
        user: {
          connect: {
            id: userId,
          },
        },
        mission: {
          connect: {
            id: missionId,
          },
        },
        family: {
          connect: {
            id: familyId,
          },
        },
      },
    });
    recordId = record.id;
  }

  const promises = pet.map(async (petId) => {
    await prisma.record_pet.create({
      data: {
        record_id: recordId,
        pet_id: Number(petId),
      },
    });
  });
  await Promise.all(promises);

  //~ 알람 저장
  const familyMembers: UserDto[] =
    await familyService.getFamilyMembersExceptUser(userId, familyId);

  familyMembers.map(async (familyMember) => {
    await prisma.alarm.create({
      data: {
        user_id: familyMember.id,
        writer_id: userId,
        family_id: familyId,
        record_id: recordId,
      },
    });
  });

  //~ 유저가 처음 기록할 때 푸시알림 전송
  if (!userNickNameAndEverRecordedInfo.ever_recorded) {
    // 유저의 기록 경험 업데이트
    userService.patchUserEverRecorded(userId);
    //~ 유저를 제외한 가족들의 fcm 토큰 저장하는 배열
    const tokens: string[] = [];
    // 본인을 제외한 가족 구성원들을 도는 맵
    const promise = familyMembers.map(async (familyMember) => {
      // 가족 구성원 한 명의 유저 정보 & fcm 토큰 정보 배열
      const userAndFcmInfos = await prisma.user.findMany({
        where: {
          id: familyMember.id,
        },
        include: {
          fcmtoken: true,
        },
      });
      // 각 fcm 토큰 배열로 저장
      userAndFcmInfos.map(async (userAndFcmInfo) => {
        const usersFcmTokensArray = userAndFcmInfo.fcmtoken;
        usersFcmTokensArray.map(async (usersFcmToken) => {
          tokens.push(usersFcmToken.fcm_token);
        });
      });
    });
    await Promise.all(promise);

    const messages = {
      android: {
        data: {
          title: 'ZOOC',
          body: `${userNickNameAndEverRecordedInfo.nick_name}가 기록한 반려동물의 첫 순간에 함께해주세요!`,
        },
      },
      apns: {
        payload: {
          aps: {
            contentAvailable: true,
            alert: {
              title: 'ZOOC',
              body: `${userNickNameAndEverRecordedInfo.nick_name}가 기록한 반려동물의 첫 순간에 함께해주세요!`,
            },
          },
        },
      },
      tokens: tokens,
    };

    const result = sendPushAlarm(messages);
  }
};

//* 기록 상세조회
const getRecord = async (
  userId: number,
  familyId: number,
  recordId: number
): Promise<RecordResponseDto> => {
  const orderedRecord = await prisma.record.findMany({
    where: {
      family_id: familyId,
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  const idx = orderedRecord.findIndex((record) => record.id === recordId);

  let leftId = null;
  let rightId = null;

  if (idx > 0) leftId = orderedRecord[idx - 1].id;
  if (idx < orderedRecord.length - 1) rightId = orderedRecord[idx + 1].id;

  const record = await prisma.record.findUnique({
    where: {
      id: recordId,
    },
  });

  if (!record) throw new Error('no record!');

  const writer = await prisma.user.findUnique({
    where: {
      id: record.writer,
    },
  });

  if (!writer) throw new Error('no record writer!');

  const recordDate = dayjs(record.created_at).format('M월 D일');

  const recordDto: RecordDto = {
    id: recordId,
    photo: record.photo,
    content: record.content,
    date: recordDate,
    writerPhoto: writer.photo,
    writerName: writer.nick_name,
  };

  const recentComments: CommentDto[] = await commentService.getAllComment(
    recordId
  );

  const recordResponseDto: RecordResponseDto = {
    leftId: leftId,
    rightId: rightId,
    userId: userId,
    record: recordDto,
    comments: recentComments,
  };

  return recordResponseDto;
};

//* 기록 전체조회
const getAllRecord = async (
  familyId: number,
  petId: number
): Promise<RecordPreviewResponseDto[]> => {
  const records = await prisma.record.findMany({
    where: {
      family_id: familyId,
    },
  });

  const recordResponse: RecordPreviewResponseDto[] = [];

  const recordPromises = records.map(async (record) => {
    const petSelectRecord = await prisma.record_pet.findFirst({
      where: {
        record_id: record.id,
        pet_id: petId,
      },
    });
    if (!petSelectRecord) return null;

    const recordPreview = await prisma.record.findUnique({
      where: {
        id: petSelectRecord.record_id,
      },
    });
    if (!recordPreview) return null;

    const writer = await prisma.user.findUnique({
      where: {
        id: recordPreview.writer,
      },
    });

    if (!writer) throw new Error('no record writer!');

    const recordDate = dayjs(recordPreview.created_at).format('M/D');

    const recordDto: RecordDto = {
      id: recordPreview.id,
      photo: recordPreview.photo,
      content: recordPreview.content,
      date: recordDate,
      writerPhoto: writer.photo,
      writerName: writer.nick_name,
    };

    const commentWriters: CommentWriterDto[] = [];

    const comments = await prisma.comment.findMany({
      where: {
        record_id: recordPreview.id,
      },
      select: {
        writer: true,
      },
    });

    const commentPromises = comments.map(async (comment) => {
      const writer = await prisma.user.findUnique({
        where: {
          id: comment.writer,
        },
        select: {
          id: true,
          photo: true,
        },
      });
      if (!writer) throw new Error('no comment writer!');

      const commentWriterDto: CommentWriterDto = {
        writerId: writer.id,
        writerPhoto: writer.photo,
      };

      const existWriter = commentWriters.find(
        (commentWriter) => commentWriter.writerId === writer.id
      );
      if (!existWriter) commentWriters.push(commentWriterDto);
    });
    await Promise.all(commentPromises);

    const data: RecordPreviewResponseDto = {
      record: recordDto,
      commentWriters: commentWriters,
    };

    recordResponse.push(data);
  });
  await Promise.all(recordPromises);

  const orderedRecordResponse = recordResponse.sort(function (a, b) {
    return b.record.id - a.record.id;
  });

  return orderedRecordResponse;
};

//* 기록 전체조회 ( 안드용 )
const getAllRecordAos = async (
  familyId: number,
  petId: number
): Promise<RecordPreviewResponseAosDto[]> => {
  const records = await prisma.record.findMany({
    where: {
      family_id: familyId,
    },
  });

  const recordResponse: RecordPreviewResponseAosDto[] = [];

  const recordPromises = records.map(async (record) => {
    const petSelectRecord = await prisma.record_pet.findFirst({
      where: {
        record_id: record.id,
        pet_id: petId,
      },
    });
    if (!petSelectRecord) return null;

    const recordPreview = await prisma.record.findUnique({
      where: {
        id: petSelectRecord.record_id,
      },
    });
    if (!recordPreview) return null;

    const writer = await prisma.user.findUnique({
      where: {
        id: recordPreview.writer,
      },
    });

    if (!writer) throw new Error('no record writer!');

    const recordDate = dayjs(recordPreview.created_at).format('M/D');

    const recordDto: RecordDto = {
      id: recordPreview.id,
      photo: recordPreview.photo,
      content: recordPreview.content,
      date: recordDate,
      writerPhoto: writer.photo,
      writerName: writer.nick_name,
    };

    const commentsResponse: CommentDto[] = [];

    const comments = await prisma.comment.findMany({
      where: {
        record_id: recordPreview.id,
      },
    });

    const commentPromises = comments.map(async (comment) => {
      const writer = await prisma.user.findUnique({
        where: {
          id: comment.writer,
        },
      });
      if (!writer) throw new Error('no comment writer!');

      const isEmoji = comment.emoji || comment.emoji === 0 ? true : false;

      const commentDate = dayjs(comment.created_at).format('M월 D일');

      const commentDto: CommentDto = {
        commentId: comment.id,
        isEmoji: isEmoji,
        writerId: writer.id,
        nickName: writer.nick_name,
        photo: writer.photo,
        content: comment.content,
        emoji: comment.emoji,
        date: commentDate,
      };

      const existWriter = commentsResponse.find(
        (commentResponse) => commentResponse.writerId === writer.id
      );
      if (!existWriter) commentsResponse.push(commentDto);
    });
    await Promise.all(commentPromises);

    const data: RecordPreviewResponseAosDto = {
      record: recordDto,
      comments: commentsResponse,
    };

    recordResponse.push(data);
  });
  await Promise.all(recordPromises);

  const orderedRecordResponse = recordResponse.sort(function (a, b) {
    return b.record.id - a.record.id;
  });

  return orderedRecordResponse;
};

//* 기록 상세조회 ( NEW !!!!!)
const getRecordNew = async (
  userId: number,
  familyId: number,
  recordId: number,
  petId: number
): Promise<RecordResponseDto> => {
  const orderedRecord = await prisma.record.findMany({
    where: {
      family_id: familyId,
    },
    orderBy: {
      created_at: 'desc',
    },
  });
  const petSelectOrderedRecord: record[] = [];

  const recordPromises = orderedRecord.map(async (record) => {
    const petSelectRecord = await prisma.record_pet.findFirst({
      where: {
        record_id: record.id,
        pet_id: petId,
      },
    });
    if (petSelectRecord) {
      const x = await prisma.record.findUnique({
        where: {
          id: petSelectRecord.record_id,
        },
      });

      if (!x) return null;
      petSelectOrderedRecord.push(x);
    }
  });
  await Promise.all(recordPromises);

  if (petSelectOrderedRecord.length === 0) throw new Error('no record!');

  const orderedRecordResponse = petSelectOrderedRecord.sort(function (a, b) {
    return b.id - a.id;
  });

  const y = orderedRecordResponse.find((record) => record.id === recordId);
  if (y === undefined) throw new Error('no record!');

  const idx = orderedRecordResponse.findIndex(
    (record) => record.id === recordId
  );

  let leftId = null;
  let rightId = null;

  if (idx > 0) leftId = orderedRecordResponse[idx - 1].id;
  if (idx < orderedRecordResponse.length - 1)
    rightId = orderedRecordResponse[idx + 1].id;

  const record = await prisma.record.findUnique({
    where: {
      id: recordId,
    },
  });

  if (!record) throw new Error('no record!');

  const writer = await prisma.user.findUnique({
    where: {
      id: record.writer,
    },
  });

  if (!writer) throw new Error('no record writer!');

  const recordDate = dayjs(record.created_at).format('M월 D일');

  const recordDto: RecordDto = {
    id: recordId,
    photo: record.photo,
    content: record.content,
    date: recordDate,
    writerPhoto: writer.photo,
    writerName: writer.nick_name,
  };

  const recentComments: CommentDto[] = await commentService.getAllComment(
    recordId
  );

  const recordResponseDto: RecordResponseDto = {
    leftId: leftId,
    rightId: rightId,
    userId: userId,
    record: recordDto,
    comments: recentComments,
  };

  return recordResponseDto;
};

const recordService = {
  getMission,
  getAllPet,
  deleteRecord,
  createRecord,
  getRecord,
  getAllRecord,
  getAllRecordAos,
  getRecordNew,
};

export default recordService;
