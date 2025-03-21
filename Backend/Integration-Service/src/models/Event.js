const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    instanceId: { type: String, required: true },  // Identifiant de l'instance (ex: cabinet du docteur)
    title: { type: String, required: true },  // Nom de l'événement (ex: Consultation)
    start: { type: Date, required: true },  // Date et heure de début
    end: { type: Date, required: true },  // Date et heure de fin
    createdBy: { type: String, required: true },  // ID du créateur (ex: ID du docteur)
}, { timestamps: true });

module.exports = mongoose.model("Event", EventSchema);
