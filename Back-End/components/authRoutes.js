const bcrypt = require('bcrypt');
const UserModel = require('../models/users');
const LoginActivity = require('../models/LoginActivity');

const loginUser = async (req, res) => {
    const { ECode, Password } = req.body;

    try {
        const user = await UserModel.findOne({ ECode });
        if (!user) {
            return res.status(400).json({ message: 'Invalid E-Code or Password' });
        }

        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid E-Code or Password' });
        }

        req.session.user = {
            id: user._id,
            Ecode: user.ECode,
            Username: user.Username,
            role: user.role
        };

        const loginActivity = new LoginActivity({
            userId: user._id,
            username: user.Username,
            activityType: 'login'
        });
        await loginActivity.save();

        res.json({ message: `Login Successful!! ${user.Username} just logged in.`, user: req.session.user });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: err.message });
    }
};

const logoutUser = async (req, res) => {
    const user = req.session.user;
    req.session.destroy(async (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.clearCookie('connect.sid');

        if (user) {
            const logoutActivity = new LoginActivity({
                userId: user.id,
                username: user.Username,
                activityType: 'logout'
            });
            await logoutActivity.save();
        }

        res.json({ message: 'Logout Successful' });
    });
};

module.exports = { loginUser, logoutUser };
