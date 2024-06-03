const mongoose = require('mongoose');

const dbConnect = mongoose.connect('mongodb://localhost:27017/testdb')
            .then(() => console.log('MongoDB connected'))
            .catch(err => console.error('MongoDB connection error:', err));

module.exports = dbConnect;