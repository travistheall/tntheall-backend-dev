// @link https://www.npmjs.com/package/dotenv
import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/.env' });
import express, { Application, Router } from 'express';
import { connectDb,} from './config';
import cors, { CorsOptions } from 'cors';
import morgan from 'morgan';

//import fileUpload from 'express-fileupload';
import {
  authRouter,
  categoryRouter,
  postRouter,
  profileRouter,
  topicRouter,
  reactionRouter,
  commentRouter,
  fileRouter
} from './routes';

const dev = process.env.DEVELOPMENT === 'true';
const app: Application = express();

//  @link https://www.twilio.com/blog/add-cors-support-express-typescript-api
const allowedOrigins = dev
  ? ['http://localhost:3000', 'http://192.168.1.120:3000']
  : [
      'https://www.tntheall.com',
      'https://tntheall.herokuapp.com',
      'https://localhost:3000',
      'http://localhost:3000'
    ];

const options: CorsOptions = {
  origin: allowedOrigins
};
// Connect Database
connectDb();

// Init Middleware
app.use(cors(options));
app.use(express.static('public'));
app.use(express.json());
app.use(morgan('dev'));


// Define Routes
const use = (path: string, router: Router) => {
  app.use(`/api/${path}`, router);
};

use('auth', authRouter);
use('category', categoryRouter);
use('profile', profileRouter);
use('post', postRouter);
use('topic', topicRouter);
use('reaction', reactionRouter);
use('comment', commentRouter);
use('upload', fileRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
