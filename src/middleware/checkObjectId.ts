import express, { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

// middleware to check for a valid object id
const checkObjectId = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.params);
  if (!Types.ObjectId.isValid(req.params['id'])) {
    console.log('checkObjectId res');
    return res.status(400).json({ msg: 'Invalid ID' });
  } else {
    next();
  }
};

export default checkObjectId;
