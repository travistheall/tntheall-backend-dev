import { Router, Request, Response } from 'express';
import { upload } from '../middleware';
import { sendToS3 } from '../utils';

const router = Router();
// @link https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-nodejs.html
// @link https://dev.to/austinbrownopspark/how-to-upload-and-serve-photos-using-react-node-express-36ii


router.post('/', upload, async (req: Request, res: Response) => {
  try {
    if (!req.files) {
      res.send({
        status: 404,
        message: 'Field files not found'
      });
    } else if (!req.body) {
      res.send({
        status: 404,
        message: 'Field location not found'
      });
    } else {
      const { files } = req;
      const { location } = req.body;
      if (Array.isArray(files)) {
        files.map(async (file) => {
          //await sendToS3(file, location);
        });
        res.send({
          status: 200,
          message: 'all files uploaded'
        })
      } else {
        res.send({
          status: 400,
          message: 'Field files needs to be an array'
        });
      }
    }
  } catch (err: any) {
    console.log('response sent');
    res.status(500).send(err);
  }
});
/*
w/o s3 buckets
@link https://attacomsian.com/blog/uploading-files-nodejs-express
*/
export default router;
