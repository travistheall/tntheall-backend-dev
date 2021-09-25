import express from 'express';
import { Food } from '../../models';

const router = express.Router();
//const { check, validationResult } = require('express-validator');
// @route    GET api/foods
// @desc     Get all foods
// @access   Public
router.get('/getall/', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/foods
// @desc     Get all foods
// @access   Public
router.get('/search/:text', async (req, res) => {
  try {
    const foods = await Food.find({ $text: { $search: req.params.text } });
    if (!foods) {
      return res.status(404).json({ msg: 'Food not found' });
    }
    res.json(foods);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/id/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ msg: 'Food not found' });
    }
    res.json(food);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/foods
// @desc     Create a foods
// @access   Publict
router.post('/create/', async (req, res) => {
  try {
    const newFood = new Food({
      Code: req.body.Code,
      Desc: req.body.Desc,
      CatNum: req.body.CatNum,
      CatDesc: req.body.CatDesc
    });
    const food = await newFood.save();
    res.json(food);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
