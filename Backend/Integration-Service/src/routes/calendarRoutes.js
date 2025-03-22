const express = require("express");
const Event = require("../models/Event");  // Assure-toi du bon chemin vers le modèle
const router = express.Router();

// ➤ Route de test pour vérifier que l'API fonctionne
router.get("/", (req, res) => {
    res.send("Calendrier API est opérationnel !");
});

// ➤ Route pour récupérer les événements d'une instance
router.get("/events/:instanceId", async (req, res) => {
    try {
        const events = await Event.find({ instanceId: req.params.instanceId });  // Recherche les événements associés à cette instance
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ➤ Route pour créer un nouvel événement
router.post("/events", async (req, res) => {
    try {
        const { instanceId, title, start, end, createdBy } = req.body;

        // Vérifier si le créneau est déjà réservé
        const conflict = await Event.findOne({
            instanceId,
            $or: [
                { start: { $lt: end }, end: { $gt: start } }, // Vérifier chevauchement
            ],
        });

        if (conflict) {
            return res.status(400).json({ message: "Ce créneau est déjà réservé" });
        }

        // Création de l'événement
        const newEvent = new Event({ instanceId, title, start, end, createdBy });
        await newEvent.save();

        res.status(201).json(newEvent);  // Retourner l'événement créé
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ➤ Route pour supprimer un événement
router.delete("/events/:id", async (req, res) => {
    try {
        const eventId = req.params.id;
        const deletedEvent = await Event.findByIdAndDelete(eventId);

        if (!deletedEvent) {
            return res.status(404).json({ message: "Événement non trouvé" });
        }

        res.json({ message: "Événement supprimé" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
