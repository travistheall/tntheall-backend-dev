import { Router, Request, Response } from 'express';
// import { check, validationResult } from 'express-validator';
// import normalize from 'normalize-url';
import { auth, checkObjectId, upload } from '../../middleware';
import { sendToS3 } from '../../utils';
import {
  SocialItems,
  SocialItem,
  DetailItem,
  DetailItems,
  AboutItem,
  AboutItems,
  ProfileInterface
} from '../../models/types';
import { Post, User, Profile } from '../../models';
import {
  server_500,
  invalid_400,
  not_found_404,
  deletion_200
} from '../genericResponses';

// Profile Creation is handled in the auth.ts file
// This is done during the sign up.
const router = Router();

type ProfileResponse = {
  errors?: [{ msg: string }];
  profiles?: ProfileInterface[];
  profile?: ProfileInterface;
};
type DeletionResponse = {
  errors?: [{ msg: string }];
  success?: [{ msg: string }];
};

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
router.post(
  '/',
  auth,
  async (
    req: Request<{}, ProfileResponse, ProfileInterface>,
    res: Response<ProfileResponse>
  ) => {
    try {
      const user = await User.findById(req.user?.id, 'email').populate(
        'profile'
      );
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
          return invalid_400(res);
        }
        const updated_profile = await Profile.findById(profile.id);
        if (!updated_profile) {
          return invalid_400(res);
        } else {
          return res.json({ profile: updated_profile });
        }
      } else {
        return invalid_400(res);
      }
    } catch (err: any) {
      console.error(err.message);
      return server_500(res, 'Server Error @ POST api/profile');
    }
  }
);

// @route    PUT api/profile/avatar
// @desc     Update a profile's avatar
// @access   Public
router.put(
  '/avatar',
  [auth, upload],
  async (
    req: Request<{}, ProfileResponse, ProfileInterface>,
    res: Response<ProfileResponse>
  ) => {
    try {
      const user = await User.findById(req.user?.id);
      if (user) {
        let profile_id = user.profile;
        const profile = await Profile.findById(profile_id);
        if (!profile) {
          return not_found_404(res, 'Profile not found');
        } else {
          const locations = await sendToS3(req, res);
          if (locations) {
            const profile_avatar_url = locations[0];
            await Profile.findByIdAndUpdate(profile_id, {
              avatar: profile_avatar_url
            });
            const updated_profile = await Profile.findById(profile_id);
            if (!updated_profile) {
              return not_found_404(res, 'Profile not found');
            } else {
              return res.json({ profile: updated_profile });
            }
          } else {
            return not_found_404(res, 'Profile avatar location not found');
          }
        }
      } else {
        invalid_400(res, 'User not found');
      }

    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ PUT api/profile/avatar');
    }
  }
);

// @route    PUT api/profile/:id
// @desc     Update a profile
// @access   Public
router.put(
  '/:id',
  [auth, checkObjectId],
  async (
    req: Request<{ id: string }, ProfileResponse, ProfileInterface>,
    res: Response<ProfileResponse>
  ) => {
    try {
      const update_profile = await Profile.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      if (!update_profile) {
        return not_found_404(res, 'Profile not found');
      } else {
        const updated_profile = await Profile.findById(req.params.id);
        if (!updated_profile) {
          return not_found_404(res, 'Profile not found');
        } else {
          return res.json({ profile: updated_profile });
        }
      }
    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ PUT api/profile/:id');
    }
  }
);

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get(
  '/',
  async (
    req: Request<{}, ProfileResponse, ProfileInterface>,
    res: Response<ProfileResponse>
  ) => {
    try {
      const profiles = await Profile.find();
      if (!profiles) {
        return not_found_404(res, 'Profiles not found');
      } else {
        res.json({ profiles: profiles });
      }
    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ GET api/profile');
    }
  }
);

// @route    GET api/profile/:id
// @desc     Get profile by profile ID
// @access   Public
router.get(
  '/:id',
  checkObjectId,
  async (
    req: Request<{ id: string }, ProfileResponse, ProfileInterface>,
    res: Response<ProfileResponse>
  ) => {
    const profile_id = req.params['id'];
    try {
      const profile = await Profile.findById(profile_id);
      if (!profile) {
        return not_found_404(res, 'Profile not found');
      } else {
        let visibleProfile = profile;
        if (!visibleProfile.skills?.isVisible) {
          delete visibleProfile.skills;
        }
        SocialItems.map((key: SocialItem) => {
          if (
            visibleProfile?.social &&
            !visibleProfile?.social[key]?.isVisible
          ) {
            delete visibleProfile.social[key];
          }
        });
        DetailItems.map((key: DetailItem) => {
          if (
            visibleProfile?.details &&
            !visibleProfile.details[key]?.isVisible
          ) {
            delete visibleProfile.details[key];
          }
        });
        AboutItems.map((key: AboutItem) => {
          if (visibleProfile?.about && !visibleProfile.about[key]?.isVisible) {
            delete visibleProfile.about[key];
          }
        });
        return res.json({ profile: visibleProfile });
      }
    } catch (err: any) {
      console.error(err.message);
      return server_500(res, 'Server Error @ GET api/profile/:id');
    }
  }
);

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete(
  '/',
  auth,
  async (
    req: Request<{}, DeletionResponse, ProfileInterface>,
    res: Response<DeletionResponse>
  ) => {
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
        deletion_200(res, 'Profile Deleted');
      }
    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ DELETE api/profile');
    }
  }
);

export default router;
