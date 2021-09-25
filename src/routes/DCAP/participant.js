import express from 'express';
import { Participant } from '../../models';

const router = express.Router();
//const { check, validationResult } = require('express-validator');
// @route    GET api/participants
// @desc     Get all participants
// @access   Public
router.get('/getall/', async (req, res) => {
  try {
    const participants = await Participant.find();
    res.json(participants);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/participants
// @desc     Get all participants
// @access   Public
router.get('/study/:studyid', async (req, res) => {
  try {
    const studyParticipants = await Participant.find({
      study: req.params.studyid
    });
    if (!studyParticipants) {
      return res.status(404).json({ msg: 'Study has no participants.' });
    }
    res.json(studyParticipants);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/id/:id', async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    if (!participant) {
      return res.status(404).json({ msg: 'Participant not found' });
    }
    res.json(participant);
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
    const participant = await Participant.insertMany(req.body);
    res.json(participant);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server fucked up');
  }
});

export default router;