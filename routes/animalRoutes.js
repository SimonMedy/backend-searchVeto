const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Animal = require('../models/Animal');
const User = require('../models/User');

router.post('/', authenticateToken, async (req, res) => {
    const { name, race, age } = req.body;
    const userId = req.user.id;

    try {
        const newAnimal = await Animal.create({
            name,
            race,
            age,
            ownerId: userId,
        });
        res.status(201).json({ message: 'Animal ajouté avec succès', animal: newAnimal });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'animal:', error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'animal' });
    }
});

router.get('/', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const animals = await Animal.findAll({ where: { ownerId: userId } });
        res.status(200).json(animals);
    } catch (error) {
        console.error('Erreur lors de la récupération des animaux:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des animaux' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const animalId = req.params.id;

    try {
        const animal = await Animal.findOne({ where: { id: animalId, ownerId: userId } });
        if (!animal) {
            return res.status(404).json({ message: 'Animal non trouvé' });
        }

        await animal.destroy();
        res.status(200).json({ message: 'Animal supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'animal:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'animal' });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const animalId = req.params.id;
    const { name, race, age } = req.body;

    try {
        const animal = await Animal.findOne({ where: { id: animalId, ownerId: userId } });
        if (!animal) {
            return res.status(404).json({ message: 'Animal non trouvé' });
        }

        animal.name = name;
        animal.race = race;
        animal.age = age;
        await animal.save();

        res.status(200).json({ message: 'Animal modifié avec succès', animal });
    } catch (error) {
        console.error('Erreur lors de la modification de l\'animal:', error);
        res.status(500).json({ message: 'Erreur lors de la modification de l\'animal' });
    }
});

module.exports = router;
