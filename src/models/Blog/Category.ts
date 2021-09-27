import { Schema, model } from 'mongoose';
import { TopicInterface } from './types';

export interface CategoryInterface {
  id: string;
  text: string;
  topics?: TopicInterface[];
}

const CategorySchema = new Schema<CategoryInterface>({
  text: { type: String, require: true },
  topics: [{ type: Schema.Types.ObjectId, ref: 'topic' }]
});

export const Category = model<CategoryInterface>('category', CategorySchema);
