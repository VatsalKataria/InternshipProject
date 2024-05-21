const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcrypt')
const session = require('express-session')
const bodyParser = require('body-parser')
const MongoStore = require('connect-mongo')
const UserModel = require('./models/users')
const MachineModel = require('./models/Machines')
const LoginActivity = require('./models/LoginActivity')
const adminRoutes = require('./Admin');

const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin:'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/testdb')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(session({
    secret: 'thisisthetestsecretkey',
    resave:false,
    saveUninitialized:false,
    store:MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/testdb' }),
    cookie: { maxAge: 60 * 1000}
}));

const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden Admins only'})
    }
};

app.use('/admin',isAdmin, adminRoutes);

app.post('/register', async (req, res) => {
    const { Username, emailAdd, ECode, Password, role } = req.body;
    const hashedPassword = await bcrypt.hash(Password, 10);

    const userData = new UserModel({
        Username,
        emailAdd,
        ECode,
        Password: hashedPassword,
        role
    });

    await userData.save()
        .then(() => res.json({ message: "Registration Successful" }))
        .catch(err => res.status(500).json({ error: err.message }));
});


app.post('/', async (req, res) => {
    const { ECode, Password } = req.body;

    try {
        const user = await UserModel.findOne({ ECode });
        if (!user) {
            return res.status(400).json({ message: 'Invalid E-Code or Password'})
        }

        const isMatch = await bcrypt.compare(Password, user.Password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid E-Code or Password'})
        }

        req.session.user = {
            id: user._id,
            Ecode: user.ECode,
            Username: user.Username,
            role: user.role
        }

        const loginActivity = new LoginActivity({
            userId: user._id,
            username: user.Username,
            activityType: 'login'
        });
        await loginActivity.save();

        res.json({ message: 'Login Successful!!', user: req.session.user})
    } catch (err) {
        res.status(500).json({ error: err.message})
    }
});

app.post('/logout', (req, res) => {
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
});


app.get('/session', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).json({ message: 'No active session'})
    }
});

app.post('/adddata', async (req, res) => {
    const { machineName, components } = req.body;

    if (!machineName || !components || components.length === 0) {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    const newMachine = new MachineModel({
        machineName,
        components
    });

    try {
        await newMachine.save();
        res.json({ message: "Machine Data added successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized'})
    }
}

app.get('/machines', isAuthenticated, async (req, res) => {
    try {
        const machines = await MachineModel.find();
        res.json(machines);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/activity', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized'});
    }

    try {
        const activities = await LoginActivity.find({ userId: req.session.user.id})
        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: error.message})
    }
})

app.listen(3000, () => {
    console.log('server running');
})