import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { rm, sc } from '../constants';
import { fail, success } from '../constants/response';
import recordService from '../service/recordService';

//? 완료하지 않은 미션 전체조회
const getMission = async (req: Request, res: Response, next: NextFunction) => {
  const userId: number = req.body.userId;

  try {
    const familyId = req.params.familyId;
    if (!familyId)
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));

    const data = await recordService.getMission(userId, +familyId);
    return res.status(sc.OK).send(success(sc.OK, rm.GET_MISSION_SUCCESS, data));
  } catch (error) {
    next(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

//? 모든 펫 조회
const getAllPet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const familyId = req.params.familyId;
    if (!familyId)
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));

    const data = await recordService.getAllPet(+familyId);
    return res.status(sc.OK).send(success(sc.OK, rm.GET_ALL_PET_SUCCESS, data));
  } catch (error) {
    next(error);

    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

//? 기록 삭제하기
const deleteRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    }

    const { recordId } = req.params;

    await recordService.deleteRecord(+recordId);
    return res.status(sc.OK).send(success(sc.OK, rm.DELETE_RECORD_SUCCESS));
  } catch (error) {
    next(error);

    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

//? 기록 작성하기
const createRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId: number = req.body.userId;

  try {
    console.log(req.file);
    const image: Express.MulterS3.File = req.file as Express.MulterS3.File;
    const { location } = image;
    const { content } = req.body;
    let { pet } = req.body;
    const { familyId } = req.params;
    const { missionId } = req.query;
    let mission: number | undefined;

    // 안드로이드를 위한 pet 하나일 때 배열로 변경하는 코드
    if (!Array.isArray(pet)) pet = new Array(pet);

    if (!familyId)
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));

    if (missionId) mission = Number(missionId);
    else mission = undefined;

    await recordService.createRecord(
      userId,
      +familyId,
      location,
      content,
      pet,
      mission
    );
    return res
      .status(sc.CREATED)
      .send(success(sc.CREATED, rm.CREATE_RECORD_SUCCESS));
  } catch (error) {
    next(error);

    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

//? 기록 상세 조회
const getRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { familyId, recordId } = req.params;
    if (!recordId)
      return res.status(sc.NOT_FOUND).send(fail(sc.NOT_FOUND, rm.NOT_FOUND));

    const data = await recordService.getRecord(+familyId, +recordId);
    return res.status(sc.OK).send(success(sc.OK, rm.GET_RECORD_SUCCESS, data));
  } catch (error) {
    next(error);

    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

//? 기록 전체 조회 (아요)
const getAllRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { familyId, petId } = req.params;
    if (!familyId || !petId)
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));

    const data = await recordService.getAllRecord(+familyId, +petId);
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_ALL_RECORD_SUCCESS, data));
  } catch (error) {
    next(error);

    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

//? 기록 전체 조회 (안드)
const getAllRecordAos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { familyId, petId } = req.params;
    if (!familyId || !petId)
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));

    const data = await recordService.getAllRecordAos(+familyId, +petId);
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_ALL_RECORD_SUCCESS, data));
  } catch (error) {
    next(error);

    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

//? 기록 상세 조회 ( NEW !!!!)
const getRecordNew = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { familyId, petId, recordId } = req.params;
    if (!recordId)
      return res.status(sc.NOT_FOUND).send(fail(sc.NOT_FOUND, rm.NOT_FOUND));

    const data = await recordService.getRecordNew(
      req.body.userId,
      +familyId,
      +recordId,
      +petId
    );
    return res.status(sc.OK).send(success(sc.OK, rm.GET_RECORD_SUCCESS, data));
  } catch (error) {
    next(error);

    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const recordController = {
  getMission,
  getAllPet,
  deleteRecord,
  createRecord,
  getRecord,
  getAllRecord,
  getAllRecordAos,
  getRecordNew,
};
export default recordController;
