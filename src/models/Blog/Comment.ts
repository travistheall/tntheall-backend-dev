import { Schema, model } from 'mongoose';
import { UserInterface } from '../User';
import { ReactionInterface } from './Reaction';

export interface CommentInterface {
  id: string;
  user: UserInterface;
  text: string;
  date: Date;
  reactions: ReactionInterface[];
  thread: CommentInterface[];
}

const CommentSchema = new Schema<CommentInterface>({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user'
  },
  text: {
    type: String
  },
  reactions: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'reaction'
    }
  ],
  date: {
    type: Date,
    default: Date.now
  },
  thread: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'comment'
    }
  ]
});

const Comment = model<CommentInterface>('comment', CommentSchema);

export default Comment;
