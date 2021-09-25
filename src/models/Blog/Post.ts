import { Schema, model } from 'mongoose';
import { UserInterface } from '../User';
import { ReactionInterface } from './Reaction';
import { CommentInterface } from './Comment';

interface Section {
  heading: string;
  body: string;
}

export interface PostInterface {
  user: UserInterface;
  sections: Section[];
  tags: string[];
  reactions: ReactionInterface[];
  comments: CommentInterface[];
  date: Date;
}

const PostSchema = new Schema<PostInterface>({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user'
  },
  sections: [
    {
      heading: {
        type: String
      },
      body: {
        type: String
      }
    }
  ],
  tags: [String],
  reactions: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'reaction'
    }
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'comment'
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

const Post = model<PostInterface>('post', PostSchema);

export default Post;
