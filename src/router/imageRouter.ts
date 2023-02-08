import { Router } from 'express';
import { upload } from '../middleware';
import { imageController } from '../controller';
const router: Router = Router();

//? 미들웨어에서 이미지를 가져가서 sc 버킷 내에 이미지를 저장함 그리고 객체 url을 넘겨줌
router.post('/single', upload.single('file'), imageController.uploadImage);
// router.post('/multi', upload.array('files'), imageController.uploadImage);

export default router;
