import { Request, Response } from 'express';
import { rm, sc } from '../constants';
import { fail, success } from '../constants/response';
import recordService from '../service/recordService';

//* 수행하지 않은 미션 조회
const getMission = async (req: Request, res: Response) => {
  try {
    //const userId: number = req.body.userId;

    const familyId = req.params.familyId;
    if (!familyId)
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));

    const data = await recordService.getMission(1, +familyId);
    return res.status(sc.OK).send(success(sc.OK, rm.GET_MISSION_SUCCESS, data));
  } catch (error) {
    console.error(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

//* 모든 펫 조회
const getAllPet = async (req: Request, res: Response) => {
  try {
    const familyId = req.params.familyId;
    if (!familyId)
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));

    const data = await recordService.getAllPet(+familyId);
    return res.status(sc.OK).send(success(sc.OK, rm.GET_ALL_PET_SUCCESS, data));
  } catch (error) {
    console.error(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

//* 기록 삭제하기
const deleteRecord = async (req: Request, res: Response) => {
  const { recordId } = req.params;

  await recordService.deleteRecord(+recordId);
  return res.status(sc.OK).send(success(sc.OK, rm.DELETE_RECORD_SUCCESS));
};

const recordController = {
  getMission,
  getAllPet,
  deleteRecord,
};
export default recordController;
