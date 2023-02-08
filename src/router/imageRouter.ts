import { Router } from 'express';
import { upload } from '../middleware';
import { imageController } from '../controller';
const router: Router = Router();

//? POST image/single
router.post('/single', upload.single('file'), imageController.uploadImage);
//? POST image/multi
router.post('/multi', upload.array('files'), imageController.uploadImages);

export default router;
