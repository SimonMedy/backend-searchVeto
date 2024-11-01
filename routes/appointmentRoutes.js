const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const Appointment = require("../models/Appointment");
const TimeSlot = require("../models/Timeslot");
const Clinic = require("../models/Clinic");
const Animal = require("../models/Animal");


router.post("/", authenticateToken, async (req, res) => {
  const { animalId, clinicId, date, timeSlotId } = req.body;
  const userId = req.user.id;

  try {
    const appointmentExists = await Appointment.findOne({
      where: { timeSlotId, date, clinicId },
    });

    if (appointmentExists) {
      return res.status(400).json({ message: "Time slot is already booked" });
    }

    const timeSlot = await TimeSlot.findOne({
      where: { id: timeSlotId, clinicId, date, available: true },
    });

    if (!timeSlot) {
      return res.status(400).json({ message: "Time slot is not available" });
    }

    const appointment = await Appointment.create({
      animalId,
      clinicId,
      date,
      timeSlotId,
      userId,
    });

    await timeSlot.update({ available: false });

    res
      .status(201)
      .json({ message: "Appointment created successfully", appointment });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Error creating appointment" });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const appointments = await Appointment.findAll({
      where: { userId },
      include: [
        {
          model: TimeSlot,
          as: "timeSlot",
        },
        {
          model: Clinic,
          as: "clinic",
        },
        {
          model: Animal,
          as: "animal",
        },
      ],
    });

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Error fetching appointments" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const appointmentId = req.params.id;

  try {
    const appointment = await Appointment.findOne({
      where: { id: appointmentId, userId },
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    await TimeSlot.update(
      { available: true },
      { where: { id: appointment.timeSlotId } }
    );

    await appointment.destroy();

    res.status(200).json({ message: "Appointment canceled successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ message: "Error deleting appointment" });
  }
});

module.exports = router;