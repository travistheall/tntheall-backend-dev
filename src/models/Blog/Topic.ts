import { Schema, model } from 'mongoose';

export interface TopicInterface {
  id: string;
  text: string;
}

const TopicSchema = new Schema<TopicInterface>({
  text: { type: String, require: true },
});

export const Topic = model<TopicInterface>('topic', TopicSchema);
