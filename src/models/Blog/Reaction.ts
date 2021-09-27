import { Schema, model } from 'mongoose';
import { UserInterface } from '../types';
export interface ReactionInterface {
  id: string;
  user: UserInterface;
  text: string;
  date: Date;
}

const ReactionSchema = new Schema<ReactionInterface>({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user'
  },
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export const Reaction = model<ReactionInterface>('reaction', ReactionSchema);

