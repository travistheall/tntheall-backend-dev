// @link https://www.npmjs.com/package/dotenv
import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/.env' });
import express, { Application, Router } from 'express';
import connectDb from './config/connectDb';
import cors, { CorsOptions } from 'cors';
import {
  authRouter,
  categoryRouter,
  postRouter,
  profileRouter,
  topicRouter,
  reactionRouter
} from './routes';
const dev = process.env.DEVELOPMENT === 'true';

const app: Application = express();

//  @link https://www.twilio.com/blog/add-cors-support-express-typescript-api
const allowedOrigins = dev
  ? ['http://localhost:3000']
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
app.use(express.json());

// Define Routes
const use = (path: string, router: Router) => {
  app.use(`/api/${path}`, router);
}
use('auth', authRouter);
use('category', categoryRouter);
use('profile', profileRouter);
use('post', postRouter);
use('topic', topicRouter);
use('reaction', reactionRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
