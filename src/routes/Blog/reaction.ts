import { Router, Request, Response } from 'express';
import { Document } from 'mongoose';
import checkObjectId from '../../middleware/checkObjectId';
import auth from '../../middleware/auth';
import { Reaction, Post, User, Comment } from '../../models';
import {
  ReactionInterface,
  PostInterface,
  CommentInterface
} from '../../models/types';
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
        return not_found_404(res, 'Reactionss not found');
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

const createReaction = async (
  req: Request<{ id: string }, ReactionResponse, ReactionInterface>,
  res: Response<ReactionResponse>,
  reactions?: ReactionInterface[],
  post?: PostInterface & Document<any, any, PostInterface>,
  comment?: CommentInterface & Document<any, any, CommentInterface>
) => {
  const reaction = new Reaction(req.body);
  await reaction.save();
  if (reactions) {
    if (post) {
      await post.updateOne({ reactions: [...reactions, reaction] });
    }
    if (comment) {
      await comment.updateOne({ reactions: [...reactions, reaction] });
    }
  } else {
    if (post) {
      await post.updateOne({ reactions: [reaction] });
    }
    if (comment) {
      await comment.updateOne({ reactions: [reaction] });
    }
  }
  return res.json({ reaction: reaction });
};

// @route    POST api/reaction/post/:id
// @desc     Update a reaction
// @access   Private
router.post(
  '/post/:id',
  auth,
  checkObjectId,
  async (
    req: Request<{ id: string }, ReactionResponse, ReactionInterface>,
    res: Response<ReactionResponse>
  ) => {
    try {
      // we need a user
      let user = await User.findById(req.user?.id);
      if (!user) {
        return not_found_404(res, 'User not found');
      }
      // we need a post
      const post_id = req.params.id;
      const post = await Post.findById(post_id).populate('reactions');
      if (!post) {
        return not_found_404(res, 'Post not found');
      }
      const reactions = post.reactions;
      // we do not need reactions
      // this may be the first reaction to the post
      if (reactions) {
        if (reactions.length > 0) {
          const user_reaction_l = reactions.filter((reaction) => {
            return `${reaction.user}` === `${req.user?.id}`;
          });
          if (user_reaction_l.length > 0) {
            let reaction_id = user_reaction_l[0].id;
            await Reaction.findByIdAndUpdate(reaction_id, req.body);
            const updated_reaction = await Reaction.findById(reaction_id);
            if (updated_reaction) {
              return res.json({ reaction: updated_reaction });
            } else {
              return not_found_404(res, 'Update Reaction Failed');
            }
          } else {
            createReaction(req, res, reactions, post);
          }
        } else {
          createReaction(req, res, undefined, post);
        }
      } else {
        createReaction(req, res, undefined, post);
      }
    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ POST api/reaction/post/:id');
    }
  }
);

// @route    POST api/reaction/comment/:id
// @desc     Update a reaction
// @access   Private
router.post(
  '/comment/:id',
  auth,
  checkObjectId,
  async (
    req: Request<{ id: string }, ReactionResponse, ReactionInterface>,
    res: Response<ReactionResponse>
  ) => {
    try {
      // we need a user
      let user = await User.findById(req.user?.id);
      if (!user) {
        return not_found_404(res, 'User not found');
      }
      // we need a post
      const comment_id = req.params.id;
      const comment = await Comment.findById(comment_id).populate('reactions');
      if (!comment) {
        return not_found_404(res, 'Comment not found');
      }
      const reactions = comment.reactions;
      // we do not need reactions
      // this may be the first reaction to the post
      if (reactions) {
        if (reactions.length > 0) {
          const user_reaction_l = reactions.filter((reaction) => {
            return `${reaction.user}` === `${req.user?.id}`;
          });
          if (user_reaction_l.length > 0) {
            let reaction_id = user_reaction_l[0].id;
            await Reaction.findByIdAndUpdate(reaction_id, req.body);
            const updated_reaction = await Reaction.findById(reaction_id);
            if (updated_reaction) {
              return res.json({ reaction: updated_reaction });
            } else {
              return not_found_404(res, 'Update Reaction Failed');
            }
          } else {
            createReaction(req, res, reactions, undefined, comment);
          }
        } else {
          createReaction(req, res, undefined, undefined, comment);
        }
      } else {
        createReaction(req, res, undefined, undefined, comment);
      }
    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ POST api/reaction/post/:id');
    }
  }
);

export default router;
