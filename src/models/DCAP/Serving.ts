import { FoodInterface, FoodPortionInterface } from '../FNDDS';
import { MealInterface } from './Meal';
import { Schema, model } from 'mongoose';

export interface ServingIterface {
  meal: MealInterface;
  food: FoodInterface;
  portion: FoodPortionInterface
  taken: number;
  returned: number;
}

const ServingSchema = new Schema({
  meal: {type: Schema.Types.ObjectId, ref:'meal'},
  food: {type: Schema.Types.ObjectId, ref:'food'},
  portion: {type: Schema.Types.ObjectId, ref:'portion'},
  taken: Number,
  returned: Number
});

const Serving = model('serving', ServingSchema);
export default Serving;
