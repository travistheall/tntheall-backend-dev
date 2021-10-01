import { Router, Request, Response } from 'express';
import { checkObjectId } from '../../middleware';
import { Category } from '../../models';
import { CategoryInterface } from '../../models/types';
import { server_500, not_found_404, deletion_200 } from '../genericResponses';

const router = Router();

type CategoryResponse = {
  errors?: [{ msg: string }];
  categories?: CategoryInterface[];
  category?: CategoryInterface;
};
type DeletionResponse = {
  errors?: [{ msg: string }];
  success?: [{ msg: string }];
};

// @route    POST api/category
// @desc     Create a category
// @access   Public
router.post(
  '/',
  async (
    req: Request<{}, CategoryResponse, CategoryInterface>,
    res: Response<CategoryResponse>
  ) => {
    try {
      const category = new Category(req.body);
      await category.save();
      res.json({ category: category });
    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ POST api/category');
    }
  }
);

// @route    GET api/category
// @desc     Get all categories
// @access   Public
router.get(
  '/',
  async (
    req: Request<{}, CategoryResponse, CategoryInterface>,
    res: Response<CategoryResponse>
  ) => {
    try {
      const categories = await Category.find().populate('topics', 'text');
      if (!categories) {
        return not_found_404(res, 'Profiles not found');
      } else {
        res.json({ categories: categories });
      }
    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ GET api/category');
    }
  }
);

// @route    DELETE api/category/:id
// @desc     Delete a category
// @access   Public
router.delete(
  '/:id',
  checkObjectId,
  async (
    req: Request<{ id: string }, DeletionResponse, CategoryInterface>,
    res: Response<DeletionResponse>
  ) => {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);
      if (!category) {
        return not_found_404(res, 'Category not found');
      }
      deletion_200(res, 'Category Deleted');
    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ DELETE api/category/:id');
    }
  }
);

// @route    PUT api/category/:id
// @desc     Update a category
// @access   Public
router.put(
  '/:id',
  checkObjectId,
  async (
    req: Request<{ id: string }, CategoryResponse, CategoryInterface>,
    res: Response<CategoryResponse>
  ) => {
    try {
      const update_category = await Category.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      if (!update_category) {
        return not_found_404(res, 'Category not found');
      } else {
        const updated_category = await Category.findById(req.params.id);
        if (!updated_category) {
          return not_found_404(res, 'Category not found');
        } else {
          return res.json({ category: updated_category });
        }
      }
    } catch (err: any) {
      console.error(err.message);
      server_500(res, 'Server Error @ PUT api/category/:id');
    }
  }
);

export default router;
