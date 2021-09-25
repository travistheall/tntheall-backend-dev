//https://www.npmjs.com/package/dotenv
import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/.env' })
import express, {Application} from 'express';
import connectDB from './config/db';
import cors, {CorsOptions} from 'cors';
import {
  authRouter,
  profileRouter,
  postRouter,
} from './routes';

const app: Application = express();

//https://www.twilio.com/blog/add-cors-support-express-typescript-api
const allowedOrigins = [
  'https://www.tntheall.com',
  'https://tntheall.herokuapp.com',
  'https://localhost:3000',
  'http://localhost:3000'
];
const options: CorsOptions = {
  origin: allowedOrigins
};
// Connect Database
connectDB();
// Init Middleware
app.use(cors(options));
app.use(express.json());

// Define Routes
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/posts', postRouter);

/*
app.use('/api/study', studyRouter);
app.use('/api/participant', participantRouter);
app.use('/api/meal', mealRouter);
app.use('/api/mealportion', mealPortionRouter);

app.use('/api/foodingredient', foodIngredientRouter);
app.use('/api/food', foodRouter);
app.use('/api/foodnut', foodNutRouter);
app.use('/api/foodport', foodPortionRouter);
*/

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
