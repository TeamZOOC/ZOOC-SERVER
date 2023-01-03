import { MypageResponseDto } from './../interface/family/MypageResponseDto';
import { FamilyDto } from './../interface/family/FamilyDto';
import { familyService } from '../service';
import { Request, Response } from 'express';
import { rm, sc } from '../constants';
import { fail, success } from '../constants/response';

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
  try {
    const data: FamilyDto = await familyService.getUserFamily(1);
    return res.status(sc.OK).send(success(sc.OK, rm.GET_FAMILY_SUCCESS, data));
  } catch (error) {
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const familyController = {
  getMypage,
  getFamilyCode,
};
export default familyController;
