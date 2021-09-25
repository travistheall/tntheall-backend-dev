import express from 'express';
import { Serving } from '../../models';

const router = express.Router();
// @route    POST api/foods
// @desc     Create a foods
// @access   Public
router.post('/', async (req, res) => {
  try {
    const newServing = new Serving({
      meal: req.body.meal_id,
      food: req.body.food_id,
      portion: req.body.portion_id,
      taken: req.body.taken,
      returned: req.body.returned
    });
    const serving = await newServing.save();
    res.json(serving);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
