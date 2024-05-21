const mongoose = require('mongoose');

const LoginActivitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, res: 'User' },
    username: { type: String, required: true },
    activityType: { type: String, enum: ['login', 'logout'], required: true },
    timestamp: { type: Date, default: Date.now }
});

const LoginActivity = mongoose.model('LoginActivity', LoginActivitySchema);

module.exports = LoginActivity;