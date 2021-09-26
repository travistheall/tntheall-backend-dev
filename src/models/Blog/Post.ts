import { UserInterface } from '../types';
import { Document, Model, Query, Schema, model } from 'mongoose';
//import { ReactionInterface } from './Reaction';
//import { CommentInterface } from './Comment';
//import { SectionInterface } from './Section';
export interface SectionInterface {
  heading: string;
  body: string;
}
export interface PostInterface {
  user: UserInterface;
  title: string;
  sections: SectionInterface[];
  tags: string[];
  reactions?: string[];
  comments?: string[];
  date: Date;
}


const PostSchema = new Schema<PostInterface>({
  user: { type: Schema.Types.ObjectId },
  title: String,
  topic: { type: Schema.Types.ObjectId },
  sections: [{
    heading: String,
    body: String,
  }],
  tags: [String],
  citations: [String],
  reactions: [{ type: Schema.Types.ObjectId }],
  comments: [{ type: Schema.Types.ObjectId }],
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

export const Post = model<PostInterface, Model<PostInterface, PostQueryHelpers>>(
  'post',
  PostSchema
);
