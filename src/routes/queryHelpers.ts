import { Document, Model, Query, Schema, connect, model } from 'mongoose';

interface ProjectInterface {
  name: string;
  stars: number;
}

const schema = new Schema<ProjectInterface>({
  name: { type: String, required: true },
  stars: { type: Number, required: true }
});
// Query helpers should return `Query<any, Document<DocType>> & ProjectQueryHelpers`
// to enable chaining.
interface ProjectQueryHelpers {
  byName(name: string): Query<any, Document<ProjectInterface>> & ProjectQueryHelpers;
}
schema.query.byName = function(name): Query<any, Document<ProjectInterface>> & ProjectQueryHelpers {
  return this.find({ name: name });
};

// 2nd param to `model()` is the Model class to return.
const ProjectModel = model<ProjectInterface , Model<ProjectInterface , ProjectQueryHelpers>>('Project', schema);
