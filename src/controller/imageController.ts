// import { imageService } from '../service';
import { Request, Response } from 'express';
import { rm, sc } from '../constants';
import { fail, success } from '../constants/response';

//! 이미지 업로드 api
const uploadImage = async (req: Request, res: Response) => {
  const image: Express.MulterS3.File = req.file as Express.MulterS3.File;
  const { location } = image;

  //? image.filename => 이미지 이름
  //? image.contentType => 이미지의 content type
  if (!location)
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.IMAGE_UPLOAD_SUCCESS));

  //~ 여기서 바로 location 응답으로 리턴하면 되는 건가..?
  return res
    .status(sc.CREATED)
    .send(success(sc.CREATED, rm.IMAGE_UPLOAD_SUCCESS, location));
};

const uploadImages = async (req: Request, res: Response) => {
  const images: Express.MulterS3.File[] = req.files as Express.MulterS3.File[];

  const locations: string[] = await Promise.all(
    images.map((image: Express.MulterS3.File) => {
      return image.location;
    })
  );

  if (!locations)
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.IMAGE_UPLOAD_SUCCESS));

  return res
    .status(sc.CREATED)
    .send(success(sc.CREATED, rm.IMAGE_UPLOAD_SUCCESS, locations));
};

const imageController = {
  uploadImage,
  uploadImages,
};

export default imageController;
