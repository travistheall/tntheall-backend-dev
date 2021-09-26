import { connect } from 'mongoose';
const uri = process.env.MONGODB_URI ? process.env.MONGODB_URI : "";

const connectDb = async () => {
  try {
    await connect(uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });

    console.log('MongoDB Connected...');
  } catch (err: any) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDb;
