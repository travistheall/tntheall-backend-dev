import { Router, Request, Response } from 'express';
import checkObjectId from '../../middleware/checkObjectId';
import { Category } from '../../models';

const router = Router();
const dev = process.env.DEVELOPMENT === 'true';
const generic_server_error = (res: Response) =>
  res.status(500).send('Server Error');

// @route    POST api/category
// @desc     Create a category
// @access   Public
router.post('/', async (req: Request, res: Response) => {
  try {
    /*if (req.body.isArray()) {
      const categories: any[] = [];
      req.body.map((category: any) => async () => {
        const c = new Category(category);
        await c.save();
        categories.push(c);
      });
      res.json(categories);
    }else {*/ 
      console.log(req.body);
      const c = new Category(req.body);
      await c.save();
      res.json([c]);
    //}
  } catch (err: any) {
    console.error(err.message);
    dev
      ? res.status(500).send('Server Error @ POST api/category')
      : generic_server_error(res);
  }
});

// @route    GET api/category
// @desc     Get all categories
// @access   Public
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ date: -1 });
    res.json(categories);
  } catch (err: any) {
    console.error(err.message);
    dev
      ? res.status(500).send('Server Error @ GET api/category')
      : generic_server_error(res);
  }
});

// @route    DELETE api/category/:id
// @desc     Delete a category
// @access   Public
router.delete(
  '/:id',
  checkObjectId,
  async (req: Request, res: Response) => {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);
      if (!category) {
        return res.status(404).json({ msg: 'Category not found' });
      }
      res.json({ msg: 'Category removed' });
    } catch (err: any) {
      console.error(err.message);
      dev
        ? res.status(500).send('Server Error @ DELETE api/category/:id')
        : generic_server_error(res);
    }
  }
);

// @route    PUT api/category/:id
// @desc     Update a category
// @access   Public
router.put(
  '/:id',
  checkObjectId,
  async (req: Request, res: Response) => {
    try {
      const category = await Category.findByIdAndUpdate(req.params.id);
      if (!category) {
        return res.status(404).json({ msg: 'Category not found' });
      }
      res.json({ msg: 'Category updated' });
    } catch (err: any) {
      console.error(err.message);
      dev
        ? res.status(500).send('Server Error @ PUT api/category/:id')
        : generic_server_error(res);
    }
  }
);

export default router;
