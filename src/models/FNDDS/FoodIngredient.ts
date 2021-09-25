import { FoodInterface } from './Food';
import { Schema, model } from 'mongoose';


export interface FoodIngredientInterface {
  food: FoodInterface;
  IngredCode: number;
  IngredDesc: string;
  Amount: number;
  PortDesc: string;
  RetCode: number;
  IngredWeight: number;
  Code: { type: Number }
};

const FoodIngredientSchema = new Schema<FoodIngredientInterface>({
  food: { type: Schema.Types.ObjectId, ref: 'food' },
  IngredCode: { type: Number },
  IngredDesc: { type: String },
  Amount: { type: Number },
  PortDesc: { type: String },
  RetCode: { type: Number },
  IngredWeight: { type: Number },
  Code: { type: Number }
});

const FoodIngredients = model<FoodIngredientInterface>('food_ingredients', FoodIngredientSchema);

export default FoodIngredients;