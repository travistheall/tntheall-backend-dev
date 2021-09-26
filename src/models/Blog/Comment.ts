import { Schema, model } from 'mongoose';
import { UserInterface } from '../types';
export interface CommentInterface {
  id: string;
  user: UserInterface;
  text: string;
  date: Date;
  reactions: string[];
  thread: string[];
}

const CommentSchema = new Schema<CommentInterface>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  text: {
    type: String
  },
  reactions: [
    {type: Schema.Types.ObjectId,}
  ],
  date: {
    type: Date,
    default: Date.now
  },
  thread: [{type: Schema.Types.ObjectId}]
});

export const Comment = model<CommentInterface>('comment', CommentSchema);
