import { UserInterface } from '../types';
import { Document, Model, Query, Schema, model } from 'mongoose';
import { ReactionInterface } from './Reaction';
import { CommentInterface } from './Comment';
import { TopicInterface } from './Topic';

export interface SectionInterface {
  heading: string;
  body: string;
}
export interface PostInterface {
  user: UserInterface;
  title: string;
  topic: TopicInterface;
  sections: SectionInterface[];
  tags: string[];
  reactions?: ReactionInterface[];
  comments?: CommentInterface[];
  date: Date;
}

const PostSchema = new Schema<PostInterface>({
  user: { type: Schema.Types.ObjectId, ref: 'user' },
  title: String,
  topic: { type: Schema.Types.ObjectId, ref: 'topic' },
  sections: [
    {
      heading: String,
      body: String
    }
  ],
  tags: [String],
  citations: [String],
  reactions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'reaction'
    }
  ],
  comments: [{ type: Schema.Types.ObjectId, ref: 'comment' }],
  date: {
    type: Date,
    default: Date.now
  }
});

interface PostQueryHelpers {
  byId(id: string): Query<any, Document<PostInterface>> & PostQueryHelpers;
}

PostSchema.query.byId = function (
  id
): Query<any, Document<PostInterface>> & PostQueryHelpers {
  return this.findById(id);
};

export const Post = model<
  PostInterface,
  Model<PostInterface, PostQueryHelpers>
>('post', PostSchema);
