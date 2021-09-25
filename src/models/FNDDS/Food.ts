import { Schema, model } from 'mongoose';

export interface FoodInterface {
  Code: number;
  Desc: string;
  WWEIA_Cat_Num: number;
  WWEIA_Cat_Desc: string;
  AddDescs: string;
}

const FoodSchema = new Schema<FoodInterface>({
  Code: { type: Number, unique: true, required: true },
  Desc: { type: String, required: true, text: true },
  WWEIA_Cat_Num: { type: Number, required: true },
  WWEIA_Cat_Desc: { type: String, required: true, text: true },
  AddDescs: { type: String, text: true },
});
FoodSchema.index({ Desc: 'text', AddDescs: 'text' });

const Food = model<FoodInterface>('food', FoodSchema);

export default Food;