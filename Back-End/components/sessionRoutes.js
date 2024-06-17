const LoginActivity = require('../models/LoginActivity');

const getSession = (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).json({ message: 'No active session' });
    }
};

const getActivity = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { username, startDate, endDate } = req.query;

    try {
        let query = {};

        if (username) {
            query.username = new RegExp(username, 'i'); // Case-insensitive search
        }
        
        if (startDate && endDate) {
            query.timestamp = {
                $gte: new Date(startDate), // Greater than or equal to start date
                $lte: new Date(endDate)    // Less than or equal to end date
            };
        }

        const activities = await LoginActivity.find(query);
        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getSession, getActivity };
