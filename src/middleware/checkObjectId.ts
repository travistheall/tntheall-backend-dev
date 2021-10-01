import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { invalid_400 } from "../routes/genericResponses";

// middleware to check for a valid object id
const checkObjectId = (req: Request, res: Response, next: NextFunction) => {
  if (!Types.ObjectId.isValid(req.params['id'])) {
    console.log('running?')
    return invalid_400(res, 'Invalid ID');
  } else {
    next();
  }
};

export { checkObjectId };
