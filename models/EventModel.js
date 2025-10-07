const pool = require("../config/dbConfig");

const EventModel = {
    createEvent: async (data) => {
        try {
            const {
                logo,
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
            } = data;

            const [result] = await pool.query(
                `INSERT INTO events 
          (logo, title, type, category, about, mode, participationType, memberLimit, eligibility, winnerPrize, runnerPrize)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    logo,
                    title,
                    type,
                    category,
                    about,
                    mode,
                    participationType,
                    memberLimit,
                    JSON.stringify(eligibility),
                    winnerPrize,
                    runnerPrize,
                ]
            );

            return result.insertId;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    getAllEvents: async () => {
        try {
            const [rows] = await pool.query(`SELECT * FROM events ORDER BY id DESC`);
            return rows.map((event) => ({
                ...event,
                eligibility: event.eligibility ? JSON.parse(event.eligibility) : [],
            }));
        } catch (error) {
            throw new Error(error.message);
        }
    },

    deleteEvent: async (id) => {
        try {
            const [result] = await pool.query(`DELETE FROM events WHERE id = ?`, [id]);
            return result.affectedRows;
        } catch (error) {
            throw new Error(error.message);
        }
    },
};

module.exports = EventModel;
