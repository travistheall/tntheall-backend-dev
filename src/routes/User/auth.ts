import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { check, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import normalize from 'normalize-url';
import gravatar from 'gravatar';
import auth from '../../middleware/auth';
import { Profile, User, UserType } from '../../models';

const JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : '';
const router = express.Router();

const dev = process.env.DEVELOPMENT === 'true';
const generic_server_error = (res: Response) => res.status(500).send('Server Error');

// @route    GET api/auth
// @desc     Get user by accessToken
// @access   Private
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    if (req.user) {
      const user = await User.findById(req.user.id, 'email').populate(
        'profile'
      );
      if (user) {
        res.json({
          user: user
        });
      }
    }
  } catch (err: any) {
    console.error(err.message);
    dev ? res.status(500).send('Server Error @ GET api/auth') : generic_server_error(res);
  }
});

// @route    POST api/auth
// @desc     Authenticate user & get accessToken
// @access   Public
router.post(
  '/sign-in',
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log('signing in', email);
    try {
      let user: UserType = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: '5 days' },
        (err: any, accessToken) => {
          if (err) throw err;
          res.json({
            accessToken
          });
        }
      );
    } catch (err: any) {
      console.error(err.message);
      dev ? res.status(500).send('Server Error @ POST api/auth') : generic_server_error(res);
    }
  }
);

// @route    POST api/auth/sign-up
// @desc     Register user
// @access   Public
router.post(
  '/sign-up',
  check('displayName', 'Display name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { displayName, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        console.log('no user');
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
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
      const payload = {
        user: {
          id: user.id
        }
      };
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
      dev ? res.status(500).send('Server Error @ POST api/auth/sign-up') : generic_server_error(res);
    }
  }
);

export default router;
