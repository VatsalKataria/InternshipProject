const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo');
const dbConnect = require('./components/dbConnect');
const { upload, handleAddData } = require('./components/uploadMiddleware');
const { isAdmin, registerUser } = require('./components/authMiddleware');
const { isAuthenticated, getMachines } = require('./components/authMiddleware');
const { loginUser, logoutUser } = require('./components/authRoutes');
const { getSession, getActivity } = require('./components/sessionRoutes');
const dataRoutes = require('./components/dataRoutes');
const adminRoutes = require('./Admin');
const MachineModel = require('./models/Machines');

const app = express();
app.use(bodyParser.json());


const allowedOrigins = ['http://localhost:5173', 'http://192.168.122.12:5173'];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json());

const sessionMiddleware = session({
    secret: 'thisisthetestsecretkey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/testdb' }),
    cookie: { maxAge: 60 * 60 * 1000 } // session duration 1hr
});

app.use(sessionMiddleware);

app.post('/register', registerUser);
app.use('/admin', isAdmin, adminRoutes);

app.post('/',loginUser);
app.post('/logout', logoutUser);

app.post('/adddata', upload, handleAddData);
app.use('/api', dataRoutes);

app.get('/machines', isAuthenticated, getMachines);

app.use('/images', express.static('uploads'));

app.use((req, res, next) => {
    console.log('Session:', req.session);
    next();
});

app.get('/session', getSession);
app.get('/activity', isAdmin, getActivity);  // Ensure only admins can access this route

const port = 3000

dbConnect
.then(() => {
    app.listen(port, '0.0.0.0' ,() => {
    console.log(`Server running on http://0.0.0.0:${port}`);
    });
})
.catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
});
