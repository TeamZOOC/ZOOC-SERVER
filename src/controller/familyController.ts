import { MypageResponseDto } from './../interface/family/MypageResponseDto';
import { FamilyDto } from './../interface/family/FamilyDto';
import { familyService } from '../service';
import { Request, Response } from 'express';
import { rm, sc } from '../constants';
import { fail, success } from '../constants/response';
import { PetDto } from '../interface/family/PetDto';
import webhook from '../modules/test-message';

const createPet = async (req: Request, res: Response) => {
  try {
    const image: Express.MulterS3.File = req.file as Express.MulterS3.File;
    const { location } = image;

    const familyId = req.params.familyId;
    const { name } = req.body;

    const data: PetDto = await familyService.createPet(
      name,
      location,
      +familyId
    );

    return res
      .status(sc.CREATED)
      .send(success(sc.CREATED, rm.CREATE_PET_SUCCESS, data));
  } catch (error) {
    console.error(error);
    const errorMessage = webhook.slackMessage(req.method, req.url, error);
    webhook.sendWebhook(errorMessage);

    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const getUserFamily = async (req: Request, res: Response) => {
  const userId: number = req.body.userId;
  try {
    const data: FamilyDto[] = await familyService.getUserFamily(userId);
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_USER_FAMILY_SUCCESS, data));
  } catch (error) {
    console.error(error);
    const errorMessage = webhook.slackMessage(
      req.method,
      req.url,
      error,
      userId
    );
    webhook.sendWebhook(errorMessage);

    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const getMypage = async (req: Request, res: Response) => {
  const userId: number = req.body.userId;
  try {
    const data: MypageResponseDto = await familyService.getMypage(userId);
    return res.status(sc.OK).send(success(sc.OK, rm.GET_MYPAGE_SUCCESS, data));
  } catch (error) {
    console.error(error);
    const errorMessage = webhook.slackMessage(
      req.method,
      req.url,
      error,
      userId
    );
    webhook.sendWebhook(errorMessage);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const getFamilyCode = async (req: Request, res: Response) => {
  const familyId = req.params.familyId;
  if (!familyId)
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));

  try {
    const data: FamilyDto = await familyService.getFamilyById(+familyId);
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_FAMILY_CODE_SUCCESS, data));
  } catch (error) {
    console.error(error);
    const errorMessage = webhook.slackMessage(req.method, req.url, error);
    webhook.sendWebhook(errorMessage);

    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const enrollUsertoFamily = async (req: Request, res: Response) => {
  const { userId, code } = req.body;

  // code가 없을 떼
  if (!code)
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));

  try {
    const data = await familyService.enrollUsertoFamily(userId, code);
    // 성공
    if (data) {
      return res
        .status(sc.CREATED)
        .send(success(sc.CREATED, rm.ENROLL_USER_TO_FAMILY_SUCCESS, data));
    }
  } catch (error: any) {
    //가족 다 찼을 때
    if (error.message === 'full family')
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.FULL_FAMILY_MEMBER));

    //잘못된 코드 입력했을 때
    if (error.message === 'no family')
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.BAD_FAMILY_CODE));

    //이미 등록된 가족일 때
    if (error.message === 'already family')
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.ALREADY_FAMILY));
  }

  return res
    .status(sc.INTERNAL_SERVER_ERROR)
    .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
};

const familyController = {
  getMypage,
  getFamilyCode,
  getUserFamily,
  createPet,
  enrollUsertoFamily,
};
export default familyController;
