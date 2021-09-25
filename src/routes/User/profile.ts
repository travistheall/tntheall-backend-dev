import express, { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import normalize from 'normalize-url';
import auth from '../../middleware/auth';
import checkObjectId from '../../middleware/checkObjectId';
import {
  SocialItems,
  SocialItem,
  DetailItem,
  DetailItems,
  AboutItem,
  AboutItems
} from '../../models/User/Profile';
import { Post, User, Profile } from '../../models';

// Profile Creation is handled in the auth.ts file
// This is done during the sign up.

const router = express.Router();


// @route    POST api/profile/
// @desc     Create or update user profile
// @access   Private
router.post('/', auth, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(
      req.user?.id,
      'email'
    ).populate('profile');
    if (user) {
      const { profile } = user;
      const update = {
        ...req.body
      };
      const update_profile = await Profile.findByIdAndUpdate(
        profile.id,
        update
      );
      if (!update_profile) {
        return res
          .status(400)
          .json({ msg: 'There is no profile for this user' });
      }
      const updated_profile = await Profile.findById(profile.id);
      return res.json({ profile: updated_profile });
    }
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});


// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get('/', async (req: Request, res: Response) => {
  try {
    const profiles = await Profile.find();
    res.json({profiles: profiles});
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/profile/user/:id
// @desc     Get profile by user ID
// @access   Public

router.get(
  '/:id',
  checkObjectId,
  async (req: Request, res: Response) => {
    const profile_id = req.params['id'];
    try {
      const profile = await Profile.findById(profile_id)
      if (!profile) {
        return res.status(400).json({ msg: 'Profile not found' });
      } else {
        let p = profile;
        if (!p.skills?.isVisible) {
          delete p.skills;
        }
        SocialItems.map((key: SocialItem) => {
          if (!p.social[key]?.isVisible) {
            delete p.social[key];
          }
        });
        DetailItems.map((key: DetailItem) => {
          if (!p.details[key]?.isVisible) {
            delete p.details[key];
          }
        });
        AboutItems.map((key: AboutItem) => {
          if (!p.about[key]?.isVisible) {
            delete p.about[key];
          }
        });
        return res.json({ profile: p });
      }
    } catch (err: any) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Server error' });
    }
  }
);

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete('/', auth, async (req: Request, res: Response) => {
  try {
    // Remove user posts
    // Remove profile
    // Remove user
    if (req.user) {
      await Promise.all([
        Post.deleteMany({ user: req.user.id }),
        Profile.findOneAndRemove({ user: req.user.id }),
        User.findOneAndRemove({ _id: req.user.id })
      ]);
      res.json({ msg: 'User deleted' });
    }
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
