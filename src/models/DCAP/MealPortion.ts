import { FoodInterface, FoodPortionInterface } from './../FNDDS';
import { MealInterface } from './Meal';
import { Schema, model } from 'mongoose';

export interface MealPortionInterface {
  meal: MealInterface;
  food: FoodInterface;
  portion: FoodPortionInterface;
  taken: number;
  returned: number;
}

const MealPortionSchema = new Schema<MealPortionInterface>({
  meal: { type: Schema.Types.ObjectId, ref: 'meal' },
  food: { type: Schema.Types.ObjectId, ref: 'food' },
  portion: { type: Schema.Types.ObjectId, ref: 'food_portion' },
  taken: { type: Number },
  returned: { type: Number }
});

const MealPortion = model<MealPortionInterface>('mealportion', MealPortionSchema);

export default MealPortion;
