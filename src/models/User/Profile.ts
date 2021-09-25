import { Document, Model, Query, Schema, model } from 'mongoose';

export interface SettingStringItem {
  text: string;
  isVisible: boolean;
}
export interface SettingStringListItem {
  text: string[];
  isVisible: boolean;
}
export interface SettingNumberItem {
  number: number;
  isVisible: boolean;
}

export interface Social {
  Github?: SettingStringItem;
  Youtube?: SettingStringItem;
  Twitter?: SettingStringItem;
  Facebook?: SettingStringItem;
  LinkedIn?: SettingStringItem;
  Instagram?: SettingStringItem;
}

export const Github: keyof Social = 'Github';
export const Youtube: keyof Social = 'Youtube';
export const Twitter: keyof Social = 'Twitter';
export const Facebook: keyof Social = 'Facebook';
export const LinkedIn: keyof Social = 'LinkedIn';
export const Instagram: keyof Social = 'Instagram';

export type SocialItem =
  | 'Github'
  | 'Youtube'
  | 'Twitter'
  | 'Facebook'
  | 'LinkedIn'
  | 'Instagram';

export const SocialItems = [
  Github,
  Youtube,
  Twitter,
  Facebook,
  LinkedIn,
  Instagram
];

export interface About {
  City?: SettingStringItem;
  State?: SettingStringItem;
  Company?: SettingStringItem;
  Job_Title?: SettingStringItem;
}

export const City: keyof About = 'City';
export const State: keyof About = 'State';
export const Company: keyof About = 'Company';
export const Job_Title: keyof About = 'Job_Title';

export type AboutItem = 'City' | 'State' | 'Company' | 'Job_Title';
export const AboutItems = [City, State, Company, Job_Title];

export interface Details {
  First_Name?: SettingStringItem;
  Last_Name?: SettingStringItem;
  Bio?: SettingStringItem;
  Website?: SettingStringItem;
}

export const First_Name: keyof Details = 'First_Name';
export const Last_Name: keyof Details = 'Last_Name';
export const Bio: keyof Details = 'Bio';
export const Website: keyof Details = 'Website';

export type DetailItem = 'First_Name' | 'Last_Name' | 'Bio' | 'Website';
export const DetailItems = [First_Name, Last_Name, Bio, Website];

export interface ProfileInterface {
  id: string;
  displayName: string;
  theme: string;
  avatar: string;
  details: Details;
  about: About;
  social: Social;
  skills?: SettingStringListItem;
  date: Date;
}

const ProfileSchema = new Schema<ProfileInterface>({
  date: {
    type: Date,
    default: Date.now
  },
  avatar: {
    type: String,
    require: true
  },
  displayName: {
    type: String,
    require: true
  },
  theme: {
    type: String,
    require: true
  },
  details: {
    type: {
      First_Name: { text: String, isVisible: Boolean },
      Last_Name: { text: String, isVisible: Boolean },
      Bio: { text: String, isVisible: Boolean },
      Website: { text: String, isVisible: Boolean }
    },
    require: false
  },
  skills: {
    type: { text: [String], isVisible: Boolean },
    require: false
  },
  about: {
    type: {
      City: { text: String, isVisible: Boolean },
      State: { text: String, isVisible: Boolean },
      Company: { text: String, isVisible: Boolean },
      Job_Title: { text: String, isVisible: Boolean }
    },
    require: false
  },
  social: {
    type: {
      Github: { text: String, isVisible: Boolean },
      Youtube: { text: String, isVisible: Boolean },
      Twitter: { text: String, isVisible: Boolean },
      Facebook: { text: String, isVisible: Boolean },
      LinkedIn: { text: String, isVisible: Boolean },
      Instagram: { text: String, isVisible: Boolean }
    },
    require: false
  }
});

interface ProfileQueryHelpers {
  byProfileId(
    id: string
  ): Query<any, Document<ProfileInterface>> & ProfileQueryHelpers;
  byDisplayName(displayName: string): Query<any, Document<ProfileInterface>> & ProfileQueryHelpers;
}

ProfileSchema.query.byProfileId = function (
  id
): Query<any, Document<ProfileInterface>> & ProfileQueryHelpers {
  return this.findById(id);
};

ProfileSchema.query.byDisplayName = function (
  displayName
): Query<any, Document<ProfileInterface>> & ProfileQueryHelpers {
  return this.find({ displayName: displayName });
};

const profile = model<
  ProfileInterface,
  Model<ProfileInterface, ProfileQueryHelpers>
>('profile', ProfileSchema);

export default profile;
