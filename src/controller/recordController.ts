import { Request, Response } from 'express';
import { rm, sc } from '../constants';
import { fail, success } from '../constants/response';
import recordService from '../service/recordService';

//? 완료하지 않은 미션 전체 조회
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

//? 모든 펫 조회
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

//? 기록 작성하기
const createRecord = async (req: Request, res: Response) => {
  try {
    //const userId: number = req.body.userId;
    const image: Express.MulterS3.File = req.file as Express.MulterS3.File;
    const { location } = image;
    const { content, pet } = req.body;
    const { familyId } = req.params;
    const { missionId } = req.query;
    let mission: number | undefined;

    if (!familyId)
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));

    if (missionId) mission = Number(missionId);
    else mission = undefined;

    // if (!missionId) {
    //   await recordService.createRecord(
    //     1,
    //     +familyId,
    //     location,
    //     content,
    //     pet,
    //     undefined
    //   );
    // } else {
    //   await recordService.createRecord(
    //     1,
    //     +familyId,
    //     location,
    //     content,
    //     pet,
    //     +missionId
    //   );
    // }
    await recordService.createRecord(
      1,
      +familyId,
      location,
      content,
      pet,
      mission
    );

    return res.status(sc.OK).send(success(sc.OK, rm.CREATE_RECORD_SUCCESS));
  } catch (error) {
    console.error(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const recordController = {
  getMission,
  getAllPet,
  createRecord,
};
export default recordController;
