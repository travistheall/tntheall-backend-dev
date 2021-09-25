import { Schema, model } from 'mongoose';

export interface StudyInterface {
  abbrev:string
}

const StudySchema = new Schema<StudyInterface>({
  Abbrev: { type: String, unique: true, required: true },
});
StudySchema.index({ Abbrev: 'text' });

const Study = model<StudyInterface>('study', StudySchema);

export default Study;