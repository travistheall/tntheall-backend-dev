import express from 'express';
import { MealPortion } from '../../models';

const router = express.Router();
// @route    GET api/mealportions
// @desc     Get all portions for a meal
// @access   Public
router.get('/meal/:mealid', async (req, res) => {
  try {
    const mealportions = await MealPortion.find({
      meal: req.params.mealid
    }).populate('food');
    res.json(mealportions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/id/:id', async (req, res) => {
  try {
    const mealportion = await MealPortion.findById(req.params.id);
    if (!mealportion) {
      return res.status(404).json({ msg: 'Portion not found' });
    }
    res.json(mealportion);
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
    const mealportion = await MealPortion.insertMany(req.body);
    res.json(mealportion);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server fucked up');
  }
});

// @route    POST api/participant
// @desc     Create a participant
// @access   Publict
router.put('/update/', async (req, res) => {
  try {
    let updated = [];
    req.body.map(async (p) => {
      console.log(p);
      const nmp = await MealPortion.updateOne(
        { _id: p['_id'] },
        {
          $set: {
            taken: p['taken'],
            returned: p['returned'],
            portion: p['portion']
          }
        },
        { upsert: true }
      );
      updated.push(nmp);
    });
    res.json(updated);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server fucked up');
  }
});

export default router;
