import express, { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import auth from '../../middleware/auth';
import checkObjectId from '../../middleware/checkObjectId';
import { Post, Comment, Reaction } from '../../models';

const router = express.Router();

// @route    POST api/posts
// @desc     Create a post
// @access   Private
router.post(
  '/',
  auth,
  check('sections', 'Sections is required').notEmpty(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      if (req.user) {
        const newPost = new Post({
          user: req.user.id,
          sections: req.body.sections,
          tags: req.body.tags,
          reactions: [],
          comments: []
        });
        const post = await newPost.save();
        res.json(post);
      }
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/posts
// @desc     Get all posts
// @access   Public
router.get('/', async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/posts/:id
// @desc     Get post by ID
// @access   Private
router.get('/:id', auth, checkObjectId, async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.json(post);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/posts/:id
// @desc     Delete a post
// @access   Private
router.delete(
  '/:id',
  [auth, checkObjectId],
  async (req: Request, res: Response) => {
    try {
      if (req.user) {
        const post = await Post.findById(req.params.id);
        if (!post) {
          return res.status(404).json({ msg: 'Post not found' });
        }
        // Check user
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({ msg: 'User not authorized' });
        }
        await post.remove();
        res.json({ msg: 'Post removed' });
      } else {
        return res.status(404).json({ msg: 'User not found' });
      }
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    Post api/posts/:id/react/
// @desc     Like or Dislike a post
// @access   Private
router.post(
  '/:id/react',
  auth,
  checkObjectId,
  async (req: Request, res: Response) => {
    try {
      if (req.user) {
        const post_id = req.params.id
        const post = await Post.findById(post_id).populate('reactions');
        if (post) {
          // Check if the post has already been reacted to
          let user_reaction = post.reactions.filter(
            (reaction) => reaction.user.toString() === req.user?.id
          );
          if (user_reaction) {
            const update = {
              ...req.body
            };
            await Reaction.findByIdAndUpdate(user_reaction[0].id, update);
            const updated_reaction = await Reaction.findById(
              user_reaction[0].id
            );
            return res.json({ reaction: updated_reaction });
          } else {
            let reaction = new Reaction({
              user: req.user?.id,
              reaction: req.body.reaction
            });
            await reaction.save();
            post.reactions.push(reaction.id);
            await post.save();
            return res.json({ reaction: reaction });
          }
        } else {
          res.status(404).send('Post not found');
        }
      }
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    Post api/posts/:id/react/
// @desc     Change Like or Dislike on a post
// @access   Private
router.post(
  '/react/:id',
  auth,
  checkObjectId,
  async (req: Request, res: Response) => {
    try {
      if (req.user) {
        const reaction_id = req.params.id;
        const update = {
          ...req.body
        };
        const update_reaction = await Reaction.findByIdAndUpdate(
          reaction_id,
          update
        );
        if (!update_reaction) {
          return res.status(400).json({ msg: 'There is no reaction' });
        }
        const updated_reaction = await Reaction.findById(reaction_id);
        return res.json({ reaction: updated_reaction });
      } else {
        return res.status(400).json({ msg: 'There is no  user' });
      }
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    Post api/posts/:id/comment/
// @desc     Comment on a post
// @access   Private
router.post(
  ':id/comment',
  auth,
  checkObjectId,
  async (req: Request, res: Response) => {
    try {
      if (req.user) {
        const post = await Post.findById(req.params.id).populate('comments');
        if (post) {
          let comment = new Comment({
            user: req.user?.id,
            comment: req.body.comment
          });
          await comment.save();
          post.comments.push(comment.id);
          await post.save();
          return res.json({ comment: comment });
        }
      } else {
        res.status(404).send('Post not found');
      }
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    Post api/posts/comment/:id
// @desc     Reply to a comment
// @access   Private
router.post(
  'comment/:id',
  auth,
  checkObjectId,
  async (req: Request, res: Response) => {
    try {
      if (req.user) {
        const comment_id = req.params.id
        const original_comment = await Comment.findById(comment_id);
        if (original_comment) {
          let reply = new Comment({
            user: req.user?.id,
            comment: req.body.comment
          });
          await reply.save();
          original_comment.thread.push(reply.id);
          await original_comment.save();
          return res.json({ comment: original_comment });
        }
      } else {
        res.status(404).send('Post not found');
      }
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

/*
// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete('/comment/:id/:comment_id', auth, async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    // Pull out comment
    const comment = post.?comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }
    // Check user
    if (comment.user.toString() !== req.user?.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    post.comments = post.comments.filter(
      ({ id }) => id !== req.params.comment_id
    );

    await post.save();

    return res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});
*/

export default router;
