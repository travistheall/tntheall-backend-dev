import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { check, validationResult, ValidationError } from 'express-validator';
import jwt from 'jsonwebtoken';
import normalize from 'normalize-url';
import gravatar from 'gravatar';
import auth from '../../middleware/auth';
import { Profile, User } from '../../models';
import { UserInterface } from '../../models/types';
import { server_500, invalid_400, not_found_404 } from '../genericResponses';

type UserResponse = {
  errors?: [{ msg: string }] | ValidationError[];
  accessToken?: string;
  user?: UserInterface;
};
const JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : '';
const router = Router();

// @route    GET api/auth
// @desc     Get user by accessToken
// @access   Private
router.get(
  '/',
  auth,
  async (req: Request<{}, UserResponse, UserInterface>, res: Response<UserResponse>) => {
    try {
      if (req.user) {
        const user = await User.findById(req.user.id, 'email').populate(
          'profile'
        );
        if (user) {
          res.json({ user: user });
        } else {
          return not_found_404(res, 'User not found');
        }
      }
    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ GET api/auth');
    }
  }
);

// @route    POST api/auth
// @desc     Authenticate user & get accessToken
// @access   Public
type SignInReqBody = { email: string; password: string };
router.post(
  '/sign-in',
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  async (
    req: Request<SignInReqBody, UserResponse, UserInterface>,
    res: Response<UserResponse>
  ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return invalid_400(res);
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return invalid_400(res);
      }
      const payload = { user: { id: user.id } };
      jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: '5 days' },
        (err: any, accessToken) => {
          if (err) {
            throw err;
          }
          res.json({ accessToken });
        }
      );
    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ POST api/auth');
    }
  }
);

// @route    POST api/auth/sign-up
// @desc     Register user
// @access   Public
type SignUpReqBody = { 
  email: string; 
  password: string;
  displayName: string;
};

router.post(
  '/sign-up',
  check('displayName', 'Display name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
  async (
    req: Request<{}, UserResponse, SignUpReqBody>,
    res: Response<UserResponse>
  ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password, displayName } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return invalid_400(res, 'User already exists');
      }
      const avatar = normalize(
        gravatar.url(email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        }),
        { forceHttps: true }
      );
      let profile = new Profile({
        displayName,
        avatar,
        theme: 'DEFAULT'
      });
      user = new User({
        email,
        avatar,
        password,
        profile
      });
      await profile.save();

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      const payload = { user: { id: user.id } };
      jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: 90000000 },
        (err, accessToken) => {
          if (err) throw err;
          res.json({ accessToken });
        }
      );
    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ POST api/auth/sign-up');
    }
  }
);

export default router;
