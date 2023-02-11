import alarmService from '../service/alarmService';
import { Request, Response, NextFunction } from 'express';
import { rm, sc } from '../constants';
import { fail, success } from '../constants/response';

const getAlarmList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId: number = req.body.userId;
  try {
    const data = await alarmService.getAlarmList(+userId);

    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_ALARM_LIST_SUCCESS, data));
  } catch (error) {
    next(error);

    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const alarmController = {
  getAlarmList,
};
export default alarmController;
