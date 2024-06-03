// Admin.js
const express = require('express');
const bcrypt = require('bcrypt');
const UserModel = require('./models/users'); // Adjust the path as necessary

const router = express.Router();

router.get('/create-admin', async (req, res) => {
    const hashedPassword = await bcrypt.hash('adminpassword', 10);
    const adminUser = new UserModel({
        Username: 'admin',
        emailAdd: 'admin@example.com',
        ECode: 'admin001',
        Password: hashedPassword,
        role: 'admin'
    });

    try {
        await adminUser.save();
        res.json({ message: 'Admin user created successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route for registering new users
router.post('/register', async (req, res) => {
    const { Username, emailAdd, ECode, Password, role } = req.body;

    if (!Username || !emailAdd || !ECode || !Password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const newUser = new UserModel({
        Username,
        emailAdd,
        ECode,
        Password: hashedPassword,
        role
    });

    try {
        await newUser.save();
        res.json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
