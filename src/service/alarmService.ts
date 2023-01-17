import { AlarmListResponseDto } from './../interface/alarm/AlarmListResponseDto';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
const prisma = new PrismaClient();

//~ 사용자의 전체 알람 조회하기
const getAlarmList = async (
  userId: number
): Promise<AlarmListResponseDto[]> => {
  // 알람 정보 불러오기
  const alarmList = await prisma.alarm.findMany({
    where: {
      user_id: userId,
    },
    include: {
      user_alarm_writer_idTouser: {
        select: {
          id: true,
          nick_name: true,
          photo: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  const alarms: AlarmListResponseDto[] = [];
  alarmList.map((alarm) => {
    const alarmObject = {
      writer: alarm.user_alarm_writer_idTouser,
      created_time: dayjs(alarm.created_at).format('YYYY.MM.DD'),
    };
    alarms.push(alarmObject);
  });

  return alarms;
};

const alarmService = {
  getAlarmList,
};

export default alarmService;
