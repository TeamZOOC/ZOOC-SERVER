import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';

const s3: S3Client = new S3Client({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_SECRET_KEY as string,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET as string,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',

    key: function (req: Express.Request, file: Express.MulterS3.File, cb) {
      cb(null, `images/${Date.now()}_${file.originalname}`);
    },
  }),
});

export default upload;
