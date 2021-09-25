import express from 'express';
import { FoodIngredient } from '../../models';

const router = express.Router();
// @route    GET api/mealportions
// @desc     Get all portions for a meal
// @access   Public
router.get('/foodid/:foodid', async (req, res) => {
  try {
    const foodingredients = await FoodIngredient.find({
      food: req.params.foodid
    });
    res.json(foodingredients);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/id/:id', async (req, res) => {
  try {
    const foodingredient = await FoodIngredient.findById(req.params.id);
    if (!foodingredient) {
      return res.status(404).json({ msg: 'Ingredient not found' });
    }
    res.json(foodingredient);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/participant
// @desc     Create a participant
// @access   Publict
router.post('/create/', async (req, res) => {
  try {
    const foodingredient = await FoodIngredient.insertMany(req.body);
    res.json(foodingredient);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server fucked up');
  }
});

export default router;