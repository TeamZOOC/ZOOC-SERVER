import { Request, Response } from 'express';
import { rm, sc } from '../constants';
import { fail, success } from '../constants/response';

const getMission = async (req: Request, res: Response) => {
  try {
    const data = await recordService.getMission();
    return res.status(sc.OK).send(success(sc.OK, rm.GET_MISSON_SUCCESS, data));
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
