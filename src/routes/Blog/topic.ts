import { Router, Request, Response } from 'express';
import { checkObjectId } from '../../middleware';
import { Topic } from '../../models';
import { TopicInterface } from '../../models/types';
import { server_500, not_found_404, deletion_200 } from '../genericResponses';

const router = Router();

type TopicResponse = {
  errors?: [{ msg: string }];
  topics?: TopicInterface[];
  topic?: TopicInterface;
};
type DeletionResponse = {
  errors?: [{ msg: string }];
  success?: [{ msg: string }];
};

// @route    POST api/topic
// @desc     Create a topic
// @access   Public
router.post(
  '/',
  async (
    req: Request<{}, TopicResponse, TopicInterface>,
    res: Response<TopicResponse>
  ) => {
    try {
      const topic = new Topic(req.body);
      await topic.save();
      res.json({ topic: topic });
    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ POST api/topic');
    }
  }
);

// @route    GET api/topic
// @desc     Get all topics
// @access   Public
router.get(
  '/',
  async (
    req: Request<{}, TopicResponse, TopicInterface>,
    res: Response<TopicResponse>
  ) => {
    try {
      const topics = await Topic.find().sort({ date: -1 });
      if (!topics) {
        return not_found_404(res, 'Profiles not found');
      } else {
        res.json({ topics: topics });
      }
    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ GET api/topic');
    }
  }
);

// @route    DELETE api/topic/:id
// @desc     Delete a topic
// @access   Public
router.delete(
  '/:id',
  checkObjectId,
  async (
    req: Request<{ id: string }, DeletionResponse, TopicInterface>,
    res: Response<DeletionResponse>
  ) => {
    try {
      const topic = await Topic.findByIdAndDelete(req.params.id);
      if (!topic) {
        return not_found_404(res, 'Topic not found');
      }
      deletion_200(res, 'Topic Deleted');
    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ DELETE api/topic/:id');
    }
  }
);

// @route    PUT api/topic/:id
// @desc     Update a topic
// @access   Public
router.put(
  '/:id',
  checkObjectId,
  async (
    req: Request<{ id: string }, TopicResponse, TopicInterface>,
    res: Response<TopicResponse>
  ) => {
    try {
      const update_topic = await Topic.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      if (!update_topic) {
        return not_found_404(res, 'Topic not found');
      } else {
        const updated_topic = await Topic.findById(req.params.id);
        if (!updated_topic) {
          return not_found_404(res, 'Topic not found');
        } else {
          return res.json({ topic: updated_topic });
        }
      }
    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ PUT api/topic/:id');
    }
  }
);

export default router;
