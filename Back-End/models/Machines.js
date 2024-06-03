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
    }
});

const MachineSchema = new mongoose.Schema({
    machineName: {
        type: String,
        required: true
    },
    components: [ComponentSchema]
});

const MachineModel = mongoose.model('Machine', MachineSchema);
module.exports = MachineModel;
