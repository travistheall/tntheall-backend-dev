import { Schema, model } from 'mongoose';

export interface TopicInterface {
  id: string;
  text: string;
}

const TopicSchema = new Schema<TopicInterface>({
  text: String,
});

export const Topic = model<TopicInterface>('topic', TopicSchema);
