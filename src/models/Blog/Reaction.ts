import { Schema, model } from 'mongoose';
import { UserInterface } from '../User';


export interface ReactionInterface {
  id: string;
  user: UserInterface;
  reaction: string;
  date: Date;
}

const ReactionSchema = new Schema<ReactionInterface>({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user'
  },
  reaction: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Reaction = model<ReactionInterface>('reaction', ReactionSchema);

export default Reaction;
