const express = require('express');
const router = express.Router();
const Clinic = require('../models/Clinic');
const { authenticateToken }= require('../middleware/auth');


router.post('/',authenticateToken, async (req, res) => {
  try {
    const clinic = await Clinic.create(req.body);
    res.status(201).json(clinic);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get('/',authenticateToken, async (req, res) => {
  try {
    const clinics = await Clinic.findAll();
    res.status(200).json(clinics);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get('/:id',authenticateToken, async (req, res) => {
  try {
    const clinic = await Clinic.findByPk(req.params.id);
    if (clinic) {
      res.status(200).json(clinic);
    } else {
      res.status(404).json({ error: 'Clinic not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.put('/:id',authenticateToken, async (req, res) => {
  try {
    const clinic = await Clinic.findByPk(req.params.id);
    if (clinic) {
      await clinic.update(req.body);
      res.status(200).json(clinic);
    } else {
      res.status(404).json({ error: 'Clinic not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const clinic = await Clinic.findByPk(req.params.id);
    if (clinic) {

      await clinic.update(req.body);
      res.status(200).json(clinic);
    } else {
      res.status(404).json({ error: 'Clinic not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id',authenticateToken, async (req, res) => {
  try {
    const clinic = await Clinic.findByPk(req.params.id);
    if (clinic) {
      await clinic.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Clinic not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
