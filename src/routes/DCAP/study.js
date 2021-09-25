import express from 'express';
import { Study } from '../../models';

const router = express.Router();

//const { check, validationResult } = require('express-validator');
// @route    GET api/studies
// @desc     Get all studies
// @access   Public
router.get('/getall/', async (req, res) => {
  try {
    const studies = await Study.find();
    res.json(studies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/studies
// @desc     Get all studies
// @access   Public
router.get('/abbrev/:text', async (req, res) => {
  try {
    const study = await Study.findOne({ Abbrev: req.params.text });
    if (!study) {
      return res.status(404).json({ msg: 'Study not found' });
    }
    res.json(study);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/id/:id', async (req, res) => {
  try {
    const study = await Study.findById(req.params.id);
    if (!study) {
      return res.status(404).json({ msg: 'Study not found' });
    }
    res.json(study);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/studies
// @desc     Create a studies
// @access   Publict
router.post('/create/', async (req, res) => {
  try {
    const newStudy = new Study({
      abbrev: req.body.abbrev
    });
    const study = await newStudy.save();
    res.json(study);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server fucked up');
  }
});

export default router;
