import { MypageResponseDto } from './../interface/family/MypageResponseDto';
import { FamilyDto } from './../interface/family/FamilyDto';
import { familyService } from '../service';
import { Request, Response, NextFunction } from 'express';
import { rm, sc } from '../constants';
import { fail, success } from '../constants/response';
import { PetDto } from '../interface/family/PetDto';
import { validationResult } from 'express-validator';

const createPet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const image: Express.MulterS3.File = req.file as Express.MulterS3.File;
    const location = req.file ? image.location : null;

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
    next(error);

    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const createPets = async (req: Request, res: Response, next: NextFunction) => {
  const images: Express.MulterS3.File[] = req.files as Express.MulterS3.File[];

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  try {
    const familyId = req.params.familyId;

    const locations: string[] = await Promise.all(
      images.map((image: Express.MulterS3.File) => {
        return image.location;
      })
    );

    const { petNames, isPetPhotos } = req.body;

    const isPetPhotosBoolean: boolean[] = await Promise.all(
      isPetPhotos.map((isPetPhoto: string) => {
        if (isPetPhoto === 'true') return true;
        else return false;
      })
    );

    const data: PetDto[] = await familyService.createPets(
      petNames,
      locations,
      isPetPhotosBoolean,
      +familyId
    );

    return res
      .status(sc.CREATED)
      .send(success(sc.CREATED, rm.CREATE_PET_SUCCESS, data));
  } catch (error) {
    next(error);

    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const getUserFamily = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId: number = req.body.userId;
  try {
    const data: FamilyDto[] = await familyService.getUserFamily(userId);
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_USER_FAMILY_SUCCESS, data));
  } catch (error) {
    next(error);

    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const getMypage = async (req: Request, res: Response, next: NextFunction) => {
  const userId: number = req.body.userId;
  try {
    const data: MypageResponseDto = await familyService.getMypage(userId);
    return res.status(sc.OK).send(success(sc.OK, rm.GET_MYPAGE_SUCCESS, data));
  } catch (error) {
    next(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const getFamilyCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    next(error);

    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const enrollUserToFamily = async (req: Request, res: Response) => {
  const { userId, code } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  try {
    const data = await familyService.enrollUserToFamily(userId, code);
    // ??????
    if (data) {
      return res
        .status(sc.CREATED)
        .send(success(sc.CREATED, rm.ENROLL_USER_TO_FAMILY_SUCCESS, data));
    }
  } catch (error: any) {
    //?????? ??? ?????? ???
    if (error.message === 'full family')
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.FULL_FAMILY_MEMBER));

    //????????? ?????? ???????????? ???
    if (error.message === 'no family')
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.BAD_FAMILY_CODE));

    //?????? ????????? ????????? ???
    if (error.message === 'already family')
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.ALREADY_FAMILY));
  }

  return res
    .status(sc.INTERNAL_SERVER_ERROR)
    .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
};

const createFamily = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  const images: Express.MulterS3.File[] = req.files as Express.MulterS3.File[];
  try {
    const userId: number = req.body.userId;

    const locations: string[] = await Promise.all(
      images.map((image: Express.MulterS3.File) => {
        return image.location;
      })
    );

    const { petNames, isPetPhotos } = req.body;

    const isPetPhotosBoolean: boolean[] = await Promise.all(
      isPetPhotos.map((isPetPhoto: string) => {
        if (isPetPhoto === 'true') return true;
        else return false;
      })
    );

    const familyId: number = await familyService.createFamily(
      userId,
      locations,
      petNames,
      isPetPhotosBoolean
    );

    return res
      .status(sc.CREATED)
      .send(
        success(sc.CREATED, rm.CREATE_FAMILY_SUCCESS, { familyId: familyId })
      );
  } catch (error) {
    next(error);

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
  createPets,
  enrollUserToFamily,
  createFamily,
};
export default familyController;
