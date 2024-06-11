const mongoose = require('mongoose');

const ComponentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: { // Added category field
        type: String,
        required: true
    }
});

const MachineSchema = new mongoose.Schema({
    machineName: {
        type: String,
        required: true
    },
    components: [ComponentSchema]
}, { timestamps: true }); // Added timestamps to track upload time/date

const MachineModel = mongoose.model('Machine', MachineSchema);
module.exports = MachineModel;
