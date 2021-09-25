import { ParticiapntInterface } from './Participant';
import { Schema, model } from 'mongoose';


export interface MealInterface {
  participant: ParticiapntInterface,
  desc: string;
  photos: string[];
  notes: string[];
}

const MealSchema = new Schema<MealInterface>({
  participant: { type: Schema.Types.ObjectId, ref: 'participant' },
  desc: { type: String },
  photos: [{ type: String }],
  notes: [{ type: String }]
});

const Meal = model<MealInterface>('meal', MealSchema);
export default Meal;
 