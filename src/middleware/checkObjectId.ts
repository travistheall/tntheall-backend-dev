import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

// middleware to check for a valid object id
const checkObjectId = (req: Request, res: Response, next: NextFunction) => {
  if (!Types.ObjectId.isValid(req.params['id'])) {
    return res.status(400).json({ msg: 'Invalid ID' });
  } else {
    next();
  }
};

export default checkObjectId;
