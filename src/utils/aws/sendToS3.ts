import { s3Client } from './s3Client';
import { Request, Response } from 'express';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';

const sendToS3 = async (req: Request, res: Response) => {
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
      const run = async () => {
        const { files } = req;
        const { location } = req.body;
        if (Array.isArray(files)) {
          const locations = files.map(
            (file) =>
              `https://tntheall.s3.amazonaws.com/static/${location}/${file.filename}`
          );
          files.map(async (file) => {
            const s3location = `static/${location}/${file.filename}`;
            fs.readFile(file.path, async (err, data) => {
              if (err) {
                throw err; // Fail if the file can't be read.
              } else {
                const params = {
                  Bucket: 'tntheall',
                  Key: s3location,
                  Body: data
                };
                const command = new PutObjectCommand(params);
                await s3Client.send(command);
              }
            });
            try {
              fs.unlinkSync(file.path)
              //file removed
            } catch(err) {
              console.log('file delete error');
              console.error(err)
            }
          });
          return locations;
        } else {
          res.send({
            status: 400,
            message: 'Field files needs to be an array'
          });
        }
      };
      let locations = await run();
      return await locations;
    }
  } catch (err) {
    console.log('Error', err);
  }
};

export { sendToS3 };
