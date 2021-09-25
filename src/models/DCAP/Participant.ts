import { Schema, model } from 'mongoose';
import { StudyInterface } from './Study';

export interface ParticiapntInterface {
  study: StudyInterface;
  name: string;
}

const ParticipantSchema = new Schema<ParticiapntInterface>({
  study: {
    type: Schema.Types.ObjectId,
    ref: 'study'
  },
  name: { type: String }
});
const Participant = model<ParticiapntInterface>(
  'participant',
  ParticipantSchema
);
export default Participant;
