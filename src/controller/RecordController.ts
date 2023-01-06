import { Request, Response } from 'express';
import { rm, sc } from '../constants';
import { fail, success } from '../constants/response';
import recordService from '../service/RecordService';

const getMission = async (req: Request, res: Response) => {
  try {
    //const userId: number = req.body.userId;
    const data = await recordService.getMission(1);
    return res.status(sc.OK).send(success(sc.OK, rm.GET_MISSION_SUCCESS, data));
  } catch (error) {
    console.error(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const RecordController = {
  getMission,
};
export default RecordController;
