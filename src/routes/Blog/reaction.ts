import { Router, Request, Response } from 'express';
import checkObjectId from '../../middleware/checkObjectId';
import auth from '../../middleware/auth';
import { Reaction } from '../../models';
import { ReactionInterface } from '../../models/types';
import { server_500, not_found_404, deletion_200 } from '../genericResponses';

const router = Router();

type ReactionResponse = {
  errors?: [{ msg: string }];
  reactions?: ReactionInterface[];
  reaction?: ReactionInterface;
};
type DeletionResponse = {
  errors?: [{ msg: string }];
  success?: [{ msg: string }];
};

// @route    POST api/reaction
// @desc     Create a reaction
// @access   Private
router.post(
  '/',
  auth,
  async (
    req: Request<{}, ReactionResponse, ReactionInterface>,
    res: Response<ReactionResponse>
  ) => {
    try {
      const reaction = new Reaction(req.body);
      await reaction.save();
      res.json({ reaction: reaction });
    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ POST api/reaction');
    }
  }
);

// @route    GET api/reaction
// @desc     Get all reactions
// @access   Public
router.get(
  '/',
  async (
    req: Request<{}, ReactionResponse, ReactionInterface>,
    res: Response<ReactionResponse>
  ) => {
    try {
      const reactions = await Reaction.find().sort({ date: -1 });
      if (!reactions) {
        return not_found_404(res, 'Profiles not found');
      } else {
        res.json({ reactions: reactions });
      }
    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ GET api/reaction');
    }
  }
);

// @route    DELETE api/reaction/:id
// @desc     Delete a reaction
// @access   Public
router.delete(
  '/:id',
  checkObjectId,
  async (
    req: Request<{ id: string }, DeletionResponse, ReactionInterface>,
    res: Response<DeletionResponse>
  ) => {
    try {
      const reaction = await Reaction.findByIdAndDelete(req.params.id);
      if (!reaction) {
        return not_found_404(res, 'Reaction not found');
      }
      deletion_200(res, 'Reaction Deleted');
    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ DELETE api/reaction/:id');
    }
  }
);

// @route    PUT api/reaction/:id
// @desc     Update a reaction
// @access   Public
router.put(
  '/:id',
  checkObjectId,
  async (
    req: Request<{ id: string }, ReactionResponse, ReactionInterface>,
    res: Response<ReactionResponse>
  ) => {
    try {
      const update_reaction = await Reaction.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      if (!update_reaction) {
        return not_found_404(res, 'Reaction not found');
      } else {
        const updated_reaction = await Reaction.findById(req.params.id);
        if (!updated_reaction) {
          return not_found_404(res, 'Reaction not found');
        } else {
          return res.json({ reaction: updated_reaction });
        }
      }
    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ PUT api/reaction/:id');
    }
  }
);

export default router;
