import { Schema, model } from 'mongoose';

export interface CategoryInterface {
  id: string;
  text: string;
  topics?: string[];
}

const CategorySchema = new Schema<CategoryInterface>({
  text: { type: String, require: true },
  topics: [{ type: Schema.Types.ObjectId }]
});

export const Category = model<CategoryInterface>('category', CategorySchema);
