import { FoodInterface } from './Food';
import { Schema, model } from 'mongoose';

export interface FoodPortionInterface {
  food: FoodInterface;
  SubCodeDesc: string;
  PortDesc: string;
  Weight: number;
}

const FoodPortionSchema = new Schema<FoodPortionInterface>({
  food: {
    type: Schema.Types.ObjectId,
    ref: 'food'
  },
  SubCodeDesc: { type: String },
  PortDesc: { type: String, required: true },
  Weight: { type: Number, required: true },
});

const FoodPortion = model<FoodPortionInterface>('food_portion', FoodPortionSchema);

export default FoodPortion;
