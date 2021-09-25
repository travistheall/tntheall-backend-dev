import express from 'express';
import { Meal } from '../../models';

const router = express.Router();

// @route    POST api/meal
// @desc     Create a meal
// @access   Public
router.get('/participant/:id', async (req, res) => {
  try {
    const meals = await Meal.find({ participant: req.params.id });
    if (!meals) {
      return res.status(404).json({ msg: 'Study has no participants.' });
    }
    res.json(meals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/meal
// @desc     Create a meal
// @access   Public
router.post('/', async (req, res) => {
  try {
    const newMeal = new Meal({
      participant: req.body.participant,
      desc: req.body.desc,
      photos: req.body.photos,
      notes: req.body.notes
    });
    const meal = await newMeal.save();
    res.json(meal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
