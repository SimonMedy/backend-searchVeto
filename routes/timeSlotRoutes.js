const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const TimeSlot = require("../models/Timeslot");
const Clinic = require("../models/Clinic");

router.get("/", authenticateToken, async (req, res) => {
  const { clinicId, date } = req.query;

  try {
    const timeSlots = await TimeSlot.findAll({
      where: {
        clinicId,
        date,
        available: true,
      },
      order: [["timeRange", "ASC"]],
    });

    return res.json(timeSlots);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des plages horaires :",
      error
    );
    return res
      .status(500)
      .json({ message: "Erreur lors de la récupération des plages horaires." });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  const { clinicId, date, timeRange } = req.body;

  try {
    const clinic = await Clinic.findByPk(clinicId);
    if (!clinic) {
      return res.status(404).json({ message: "Clinique non trouvée" });
    }
    const existingSlot = await TimeSlot.findOne({
      where: { clinicId, date, timeRange },
    });

    if (existingSlot) {
      return res
        .status(400)
        .json({ message: "Cette plage horaire existe déjà pour cette date." });
    }

    const newTimeSlot = await TimeSlot.create({
      clinicId,
      date,
      timeRange,
      available: true,
    });

    return res
      .status(201)
      .json({
        message: "Plage horaire créée avec succès",
        timeSlot: newTimeSlot,
      });
  } catch (error) {
    console.error("Erreur lors de la création de la plage horaire :", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la création de la plage horaire." });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  const timeSlotId = req.params.id;
  const { available } = req.body;

  try {
    const timeSlot = await TimeSlot.findByPk(timeSlotId);
    if (!timeSlot) {
      return res.status(404).json({ message: "Plage horaire non trouvée" });
    }

    timeSlot.available = available;
    await timeSlot.save();

    return res
      .status(200)
      .json({ message: "Plage horaire mise à jour avec succès", timeSlot });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la plage horaire :", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de la plage horaire." });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const timeSlotId = req.params.id;

  try {
    const timeSlot = await TimeSlot.findByPk(timeSlotId);
    if (!timeSlot) {
      return res.status(404).json({ message: "Plage horaire non trouvée" });
    }

    await timeSlot.destroy();
    return res
      .status(200)
      .json({ message: "Plage horaire supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la plage horaire :", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la suppression de la plage horaire." });
  }
});

module.exports = router;
