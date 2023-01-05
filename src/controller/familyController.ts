import { MypageResponseDto } from './../interface/family/MypageResponseDto';
import { FamilyDto } from './../interface/family/FamilyDto';
import { familyService } from '../service';
import { Request, Response } from 'express';
import { rm, sc } from '../constants';
import { fail, success } from '../constants/response';
import { PetDto } from '../interface/family/PetDto';

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
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const getUserFamily = async (req: Request, res: Response) => {
  try {
    const userId: number = req.body.userId;
    const data: FamilyDto[] = await familyService.getUserFamily(userId);
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_USER_FAMILY_SUCCESS, data));
  } catch (error) {
    console.error(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const getMypage = async (req: Request, res: Response) => {
  try {
    const data: MypageResponseDto = await familyService.getMypage(1);
    return res.status(sc.OK).send(success(sc.OK, rm.GET_MYPAGE_SUCCESS, data));
  } catch (error) {
    console.error(error);
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
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const familyController = {
  getMypage,
  getFamilyCode,
  getUserFamily,
  createPet,
};
export default familyController;
