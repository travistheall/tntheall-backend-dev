import { FoodInterface } from './Food';
import { Schema, model } from 'mongoose';

export interface FoodNutInterface {
  food: FoodInterface;
  NutrientDesc: string,
  NutrientVal: number,
  Unit: string
}

const FoodNutSchema = new Schema<FoodNutInterface>({
  food: {
    type: Schema.Types.ObjectId,
    ref: 'food'
  },
  NutrientDesc: { type: String, required: true },
  NutrientVal: { type: Number, required: true },
  Unit: { type: String, required: true }
});
const FoodNut = model<FoodNutInterface>('foodnut', FoodNutSchema);

export default FoodNut;

