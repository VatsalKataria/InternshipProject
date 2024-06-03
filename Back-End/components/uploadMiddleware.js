const multer = require('multer');
const path = require('path');
const MachineModel = require('../models/Machines'); // Assuming you have a MachineModel

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

const handleAddData = async (req, res) => {
    try {
        const { machineName, components } = req.body;
        const parsedComponents = JSON.parse(components).map((component, index) => ({
            ...component,
            image: req.files[index].filename ? req.files[index].filename : null
        }));

        if (!machineName || !parsedComponents || parsedComponents.length === 0) {
            return res.status(400).json({ error: 'Invalid input data' });
        }

        const newMachine = new MachineModel({
            machineName,
            components: parsedComponents
        });

        await newMachine.save();
        res.json({ message: "Machine Data added successfully!" });
    } catch (err) {
        console.error('Error in handleAddData:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { upload, handleAddData };
