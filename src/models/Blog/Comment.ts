import { Schema, model } from 'mongoose';
import { ProfileInterface, ReactionInterface } from '../types';

export interface CommentInterface {
  id: string;
  profile: ProfileInterface;
  text: string;
  date: Date;
  reactions: ReactionInterface[];
}

const CommentSchema = new Schema<CommentInterface>({
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'profile'
  },
  text: {
    type: String
  },
  reactions: [{ type: Schema.Types.ObjectId, ref: 'reaction' }],
  date: {
    type: Date,
    default: Date.now
  },
});

export const Comment = model<CommentInterface>('comment', CommentSchema);
