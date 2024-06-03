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

    try {
        const activities = await LoginActivity.find({ userId: req.session.user.id });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getSession, getActivity };
