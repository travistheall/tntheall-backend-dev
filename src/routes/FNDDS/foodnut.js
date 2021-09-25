import express from 'express';
import { Food, FoodNut} from '../../models'

const router = express.Router();
// @route    POST api/foods
// @desc     Create a foods
// @access   Public
router.post('/create/', async (req, res) => {
  try {
    const food = await Food.findOne({ Code: req.body.Code });
    const newFoodNut = new FoodNut({
      Food: food.id,
      Desc: req.body.Desc,
      Val: req.body.Val,
      Unit: req.body.Unit
    });
    const foodnut = await newFoodNut.save();
    res.json(foodnut);
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
    const foodnut = await FoodNut.find().limit(65);
    res.json(foodnut);
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
    const food = await Food.findById(req.body.foodid);
    console.log(food)
    const foodnut = await FoodNut.find({food: req.params.foodid});
    console.log(foodnut)
    if (!foodnut) {
      return res.status(404).json({ msg: 'Food not found' });
    }
    res.json(foodnut);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
