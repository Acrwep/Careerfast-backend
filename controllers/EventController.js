const EventModel = require("../models/EventModel");

const createEvent = async (req, res) => {
    try {
        const {
            title,
            type,
            category,
            about,
            mode,
            participationType,
            memberLimit,
            eligibility,
            winnerPrize,
            runnerPrize,
        } = req.body;

        const parsedEligibility = eligibility ? JSON.parse(eligibility) : [];

        const logo = req.file ? `/uploads/events/${req.file.filename}` : null;

        const eventId = await EventModel.createEvent({
            logo,
            title,
            type,
            category,
            about,
            mode,
            participationType,
            memberLimit: participationType === "Team" ? memberLimit : null,
            eligibility: parsedEligibility,
            winnerPrize,
            runnerPrize,
        });

        res.status(201).json({
            success: true,
            message: "Event created successfully",
            data: { id: eventId },
        });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllEvents = async (req, res) => {
    try {
        const events = await EventModel.getAllEvents();
        res.status(200).json({
            success: true,
            message: "Events fetched successfully",
            data: events,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching events",
            details: error.message,
        });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await EventModel.deleteEvent(id);
        if (!deleted)
            return res.status(404).json({ success: false, message: "Event not found" });
        res.status(200).json({ success: true, message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting event",
            details: error.message,
        });
    }
};

module.exports = {
    createEvent,
    getAllEvents,
    deleteEvent,
};
