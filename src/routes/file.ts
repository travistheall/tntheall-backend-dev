import { Router, Request, Response } from 'express';
import multer from 'multer';
import { s3Client } from '../config/s3Client';
import { PutObjectCommand, PutObjectCommandOutput } from '@aws-sdk/client-s3';

const router = Router();
const upload = multer();
// @link https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-nodejs.html

const uploadFile = async (file: Express.Multer.File, location: string) => {
  try {
    const params = {
      Bucket: 'tntheall',
      Key: `${location}/${file.originalname}`,
      Body: file.buffer
    };
    const results = await s3Client.send(new PutObjectCommand(params));
    return results;
  } catch (err) {
    console.log('Error', err);
  }
};

router.post(
  '/',
  upload.array('files'),
  async (req: Request, res: Response) => {
    console.log('ran');
    console.log(req?.body["location"]);
    try {
      if (!req.file) {
        if (!req.files) {
          res.send({
            status: false,
            message: 'No file uploaded'
          });
        } else {
          const { files } = req;
          console.log('files', files);
          if (Array.isArray(files)) {
            const results: PutObjectCommandOutput[] = [];
            files.map(async (file) => {
              const result = await uploadFile(file, req?.body["location"]);
              if (result) {
                results.push(result);
              }
            });
            if (results) {
              return res.json({ files: results });
            }
          }
        }
      } else {
        const { file } = req;
        console.log('file', file);
        const results = await uploadFile(file, req?.body["location"]);
        if (results) {
          return res.json({ files: results });
        }
      }
    } catch (err: any) {
      res.status(500).send(err);
    }
  }
);

export default router;
