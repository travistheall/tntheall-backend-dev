import { Router, Request, Response } from 'express';
import checkObjectId from '../../middleware/checkObjectId';
import auth from '../../middleware/auth';
import { Comment, Post, User } from '../../models';
import { CommentInterface } from '../../models/types';
import { server_500, not_found_404, deletion_200 } from '../genericResponses';

const router = Router();

type CommentResponse = {
  errors?: [{ msg: string }];
  comments?: CommentInterface[];
  comment?: CommentInterface;
};
type DeletionResponse = {
  errors?: [{ msg: string }];
  success?: [{ msg: string }];
};

// @route    POST api/comment
// @desc     Create a comment
// @access   Private
router.post(
  '/',
  auth,
  async (
    req: Request<{}, CommentResponse, CommentInterface>,
    res: Response<CommentResponse>
  ) => {
    try {
      const comment = new Comment(req.body);
      await comment.save();
      res.json({ comment: comment });
    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ POST api/comment');
    }
  }
);

// @route    POST api/comment/ids
// @desc     Post an array of ids from a post and get the object back
// @access   Private
router.post(
  '/ids',
  auth,
  async (
    req: Request<{}, CommentResponse, { ids: string[] }>,
    res: Response<CommentResponse>
  ) => {
    try {
      const { ids } = req.body;
      const comments = await Comment.find({
        _id: { $in: ids }
      }).populate('reactions profile');
      if (comments) {
        res.json({ comments: comments });
      }
    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ POST api/comment');
    }
  }
);

// @route    GET api/comment
// @desc     Get all comments
// @access   Public
router.get(
  '/',
  async (
    req: Request<{}, CommentResponse, CommentInterface>,
    res: Response<CommentResponse>
  ) => {
    try {
      const comments = await Comment.find().sort({ date: -1 });
      if (!comments) {
        return not_found_404(res, 'Comments not found');
      } else {
        res.json({ comments: comments });
      }
    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ GET api/comment');
    }
  }
);

// @route    DELETE api/comment/:id
// @desc     Delete a comment
// @access   Public
router.delete(
  '/:id',
  checkObjectId,
  async (
    req: Request<{ id: string }, DeletionResponse, CommentInterface>,
    res: Response<DeletionResponse>
  ) => {
    try {
      const comment = await Comment.findByIdAndDelete(req.params.id);
      if (!comment) {
        return not_found_404(res, 'Comment not found');
      }
      deletion_200(res, 'Comment Deleted');
    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ DELETE api/comment/:id');
    }
  }
);

// @route    PUT api/comment/:id
// @desc     Update a comment
// @access   Public
router.put(
  '/:id',
  checkObjectId,
  async (
    req: Request<{ id: string }, CommentResponse, CommentInterface>,
    res: Response<CommentResponse>
  ) => {
    try {
      const update_comment = await Comment.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      if (!update_comment) {
        return not_found_404(res, 'Comment not found');
      } else {
        const updated_comment = await Comment.findById(req.params.id);
        if (!updated_comment) {
          return not_found_404(res, 'Comment not found');
        } else {
          return res.json({ comment: updated_comment });
        }
      }
    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ PUT api/comment/:id');
    }
  }
);

// @route    POST api/comment/post/:id
// @desc     Update a comment
// @access   Private
router.post(
  '/post/:id',
  auth,
  checkObjectId,
  async (
    req: Request<{ id: string }, CommentResponse, CommentInterface>,
    res: Response<CommentResponse>
  ) => {
    try {
      // we need a user
      let user = await User.findById(req.user?.id).populate('profile');
      if (!user) {
        return not_found_404(res, 'User not found');
      }
      let profile_id = user.profile.id;
      // we need a post
      const post_id = req.params.id;
      const post = await Post.findById(post_id);
      if (!post) {
        return not_found_404(res, 'Post not found');
      }
      const comments = post.comments;
      // we do not need comments
      // this may be the first comment to the post
      const comment = new Comment({ ...req.body, profile: profile_id });
      await comment.save();
      if (comments) {
        await post.updateOne({ comments: [...comments, comment] });
      } else {
        await post.updateOne({ comments: [comment] });
      }
      console.log(comment);
      return res.json({ comment: comment });
    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ POST api/comment/post/:id');
    }
  }
);
export default router;
