const bcrypt = require('bcrypt');
const UserModel = require('../models/users');
const MachineModel = require('../models/Machines');

const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden Admins only' });
    }
};

const registerUser = async (req, res) => {
    const { Username, emailAdd, ECode, Password, role } = req.body;
    const hashedPassword = await bcrypt.hash(Password, 10);

    const userData = new UserModel({
        Username,
        emailAdd,
        ECode,
        Password: hashedPassword,
        role
    });

    try {
        await userData.save();
        res.json({ message: "Registration Successful" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.role === 'admin' || req.session.user.role === 'user') {
            next();
        } else {
            res.status(403).json({ error: 'Forbidden' });
        }
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

const getMachines = async (req, res) => {
    try {
        const machines = await MachineModel.find();
        res.json(machines);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { isAdmin, registerUser, isAuthenticated, getMachines }