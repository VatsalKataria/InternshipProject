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
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

const sessionMiddleware = session({
    secret: 'thisisthetestsecretkey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/testdb' }),
    cookie: { maxAge: 15 * 60 * 1000 }
});

app.use(sessionMiddleware);

app.post('/register', registerUser);
app.use('/admin', isAdmin, adminRoutes);

app.post('/', loginUser);
app.post('/logout', logoutUser);

app.post('/adddata', upload.array('images'), handleAddData);
app.use(dataRoutes);

app.get('/machines', isAuthenticated, getMachines);

app.use('/images', express.static('uploads'));

app.use((req, res, next) => {
    console.log('Session:', req.session);
    next();
});

app.get('/session', getSession);
app.get('/activity', getActivity);

dbConnect
.then(() => {
    app.listen(3000, () => {
      console.log(`Server is running on port 3000`);
    });
})
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });
