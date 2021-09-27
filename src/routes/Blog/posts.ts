import express, { Request, Response } from 'express';
// import { check, validationResult } from 'express-validator';
import auth from '../../middleware/auth';
import checkObjectId from '../../middleware/checkObjectId';
import { User, Post, Topic } from '../../models';
import { PostInterface } from '../../models/types';
import { server_500, not_found_404, deletion_200 } from '../genericResponses';

const router = express.Router();

type PostResponse = {
  errors?: [{ msg: string }];
  posts?: PostInterface[];
  post?: PostInterface;
};
type DeletionResponse = {
  errors?: [{ msg: string }];
  success?: [{ msg: string }];
};

// POST REQUESTS
// @route    POST api/post
// @desc     Create a post
// @access   Private
router.post(
  '/',
  auth,
  async (
    req: Request<{}, PostResponse, PostInterface>,
    res: Response<PostResponse>
  ) => {
    try {
      let user = await User.findById(req?.user?.id);
      if (user) {
        let b = {
          ...req.body,
          user
        };
        const post = new Post(b);
        await post.save();
        res.json({ post: post });
      }
    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ POST api/post');
    }
  }
);

// GET REQUESTS
// @route    GET api/post
// @desc     Get all posts
// @access   Public
router.get(
  '/',
  async (
    req: Request<{}, PostResponse, PostInterface>,
    res: Response<PostResponse>
  ) => {
    try {
      const posts = await Post.find(
        {},
        'topic title reactions comments sections'
      ).populate('topic reactions', 'text');
      if (!posts) {
        return not_found_404(res, 'Posts not found');
      } else {
        return res.json({ posts: posts });
      }
    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ GET api/post');
    }
  }
);

// @route    GET api/post/:id
// @desc     Get Post by ID
// @access   Public
router.get(
  '/:id',
  checkObjectId,
  async (
    req: Request<{ id: string }, PostResponse, PostInterface>,
    res: Response<PostResponse>
  ) => {
    try {
      const post = await Post.findById(req.params.id).populate('reactions');
      if (!post) {
        return not_found_404(res, 'Post not found');
      } else {
        return res.json({ post: post });
      }
    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ GET api/post/:id');
    }
  }
);

// @route    GET api/post/topic/:id
// @desc     Get Posts by Topic ID
// @access   Public
router.get(
  '/topic/:id',
  checkObjectId,
  async (
    req: Request<{ id: string }, PostResponse, PostInterface>,
    res: Response<PostResponse>
  ) => {
    try {
      const topic = await Topic.findById(req.params.id);
      if (topic){
        const posts = await Post.find({ topic: topic }, 'topic title reactions comments sections').populate(
          'topic reactions', 'text'
        );
        if (!posts) {
          return not_found_404(res, 'No posts from this topic');
        } else {
          return res.json({ posts: posts });
        }
      } else {
        return not_found_404(res, 'Topic not found');
      }
    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ GET api/post/:id');
    }
  }
);

// DELETE REQUESTS
// @route    DELETE api/post/:id
// @desc     Delete a post
// @access   Private
router.delete(
  '/:id',
  [auth, checkObjectId],
  async (
    req: Request<{ id: string }, DeletionResponse, PostInterface>,
    res: Response<DeletionResponse>
  ) => {
    try {
      if (req.user) {
        const post = await Post.findById(req.params.id);
        if (!post) {
          return not_found_404(res, 'Post not found');
        }
        // Check user
        if (post.user.toString() !== req.user.id) {
          return not_found_404(res, 'User not authorized');
        }
        await post.remove();
        deletion_200(res, 'Post Deleted');
      } else {
        return not_found_404(res, 'User not found');
      }
    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ DELETE api/post/:id');
    }
  }
);
/*
// PUT REQUESTS
// @route    PUT api/post/:id
// @desc     Update a post
// @access   Public
router.put(
  '/:id',
  [auth, checkObjectId],
  async (
    req: Request<{ id: string }, PostResponse, PostInterface>,
    res: Response<PostResponse>
  ) => {
    try {
      const post = await Post.findById(req.params.id).populate('reactions');
      if (post) {
        Object.entries(req.body).map(async ([key, value]) => {
          switch (key) {
            case 'reactions':
              if (post.reactions?.length === 0) {
                const reaction = new Reaction(value[0]);
                await reaction.save();
                if (reaction) {
                  await post.update({reactions: [reaction]});
                  const updated_post = await Post.findById(req.params.id);
                  return updated_post
                    ? res.json({ post: updated_post })
                    : not_found_404(res, 'Post not found');
                } else {
                  return not_found_404(res, 'Post not found');
                }
              } else {
                const { reactions } = post;
                const reaction = reactions?.filter(reaction => reaction.user === req.user?.id)
                if (reaction) {
                  reaction.update
                }
                // const reaction = new Reaction(value);
                await reaction.save();
                await post.updateOne({ reactions: [reaction.id] });
                const updated_post = await Post.findById(req.params.id);
                return updated_post
                  ? res.json({ post: updated_post })
                  : not_found_404(res, 'Post not found');
              }
            default:
              break;
          }
        });
      } /*
      const update_post = await Post.findByIdAndUpdate(req.params.id, req.body);
      if (!update_post) {
        return not_found_404(res, 'Post not found');
      } else {
        const updated_post = await Post.findById(req.params.id);
        if (!updated_post) {
          return not_found_404(res, 'Post not found');
        } else {
          return res.json({ post: updated_post });
        }
      }
    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ PUT api/post/:id');
    }
  }
);

// @route    POST api/post/:id/react/
// @desc     Like or Dislike a post
// @access   Private
router.post(
  '/:id/react',
  auth,
  checkObjectId,
  async (
    req: Request<{ id: string }, PostResponse, PostInterface>,
    res: Response<PostResponse>
  ) => {
    try {
        const post = await Post.findById(req.params.id).populate('reactions');
        if (post) {
          // Check if the post has already been reacted to
          let user_reaction = post.reactions?.filter(
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
            post.reactions?.push(reaction.id);
            await post.save();
            return res.json({ reaction: reaction });
          }
        } else {
          res.status(404).send('Post not found');
        }
      }
    } catch (err: any) {
      console.error(err.message);
      dev
        ? res.status(500).send('Server Error @ POST api/post/:id/react/')
        : generic_server_error(res);
    }
  }
);

/*
// @route    POST api/post/:id/react/
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
      dev
        ? res.status(500).send('Server Error @ POST api/post/:id/react/')
        : generic_server_error(res);
    }
  }
);

// @route    POST api/post/:id/comment/
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
          post.comments?.push(comment.id);
          await post.save();
          return res.json({ comment: comment });
        }
      } else {
        res.status(404).send('Post not found');
      }
    } catch (err: any) {
      console.error(err.message);
      dev
        ? res.status(500).send('Server Error @ POST api/post/:id/comment/')
        : generic_server_error(res);
    }
  }
);

// @route    POST api/post/comment/:id
// @desc     Reply to a comment
// @access   Private
router.post(
  'comment/:id',
  auth,
  checkObjectId,
  async (req: Request, res: Response) => {
    try {
      if (req.user) {
        const comment_id = req.params.id;
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
      dev
        ? res.status(500).send('Server Error @ POST api/post/comment/:id')
        : generic_server_error(res);
    }
  }
);

/
// @route    DELETE api/post/comment/:id/:comment_id
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
    return dev ? res.status(500).send('Server Error @ POST REQUEST api/post') : generic_server_error(res);
  }
});
*/

export default router;
