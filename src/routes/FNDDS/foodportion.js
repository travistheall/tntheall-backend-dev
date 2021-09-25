import express from 'express';
import {Food, FoodPortion} from '../../models';

const router = express.Router();
// @route    POST api/foods
// @desc     Create a foods
// @access   Public
router.post('/', async (req, res) => {
  try {
    const food = await Food.findOne({ Code: req.body.Code });
    const newFoodPortion= new FoodPortion({
        food: food.id,
          SubCodeDesc: req.body.SubCodeDesc,
          SeqNum: req.body.SeqNum,
          Val: req.body.Val,
          Unit: req.body.Unit
    });
    const foodport = await newFoodPortion.save();
    res.json(foodport);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    Get api/foodnut
// @desc     Create a foodnut
// @access   Public
router.get('/getall/', async (req, res) => {
  try {
    const foodport = await FoodPortion.find();
    res.json(foodport);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    Get api/foodnut
// @desc     Create a foodnut
// @access   Publict
router.get('/foodid/:foodid', async (req, res) => {
  try {
    const foodports = await FoodPortion.find({food: req.params.foodid});
    if (!foodports) {
      return res.status(404).json({ msg: 'Food not found' });
    }
    res.json(foodports);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
