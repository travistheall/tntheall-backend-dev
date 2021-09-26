import { Document, Model, Query, Schema, model } from 'mongoose';
import { ProfileInterface } from './Profile';

export interface UserInterface {
  id: string;
  email: string;
  password: string;
  date: Date;
  profile: ProfileInterface;
} 

const UserSchema = new Schema<UserInterface>({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  profile: {
    type: Schema.Types.ObjectId,
    require: true,
    unique: true,
    ref: 'profile'
  },
});

interface UserQueryHelpers {
  byId(id: string): Query<any, Document<UserInterface>> & UserQueryHelpers;
}

UserSchema.query.byId = function (
  id
): Query<any, Document<UserInterface>> & UserQueryHelpers {
  return this.findById(id);
};

export const User = model<UserInterface , Model<UserInterface , UserQueryHelpers>>('user', UserSchema);
