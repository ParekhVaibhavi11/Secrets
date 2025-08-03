// index.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = '2efb8cbba563127265cb6d0bef0a76262962033ffd2626301f5bf5724e5bb873'; // CHANGE THIS IN PRODUCTION!

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.set('view engine', 'ejs');

// Replace this entire block with your correct MongoDB Atlas connection string
//
// const MONGODB_URI = 'your_mongodb_atlas_connection_string'; // Replace with your string
// mongoose.connect(MONGODB_URI)
//   .then(() => console.log('Connected to MongoDB Atlas'))
//   .catch(err => console.error('Could not connect to MongoDB Atlas...', err));
//
// You also had this duplicate local connection which should be removed
// mongoose.connect('mongodb://localhost:27017/secretsDB')
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('Could not connect to MongoDB...', err));


// This is the correct, final database connection block
const MONGODB_URI = 'mongodb+srv://vaibhaviparekh2812:10092005@secrets.westjam.mongodb.net/?retryWrites=true&w=majority&appName=secrets'; // PASTE YOUR ATLAS STRING HERE

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB Atlas...', err));


// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address']
  },
  password: { type: String, required: true }
});

// Password Hashing Middleware
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const User = mongoose.model('User', userSchema);

// Routes
// Root URL redirect
app.get('/', (req, res) => {
  res.redirect('/register');
});

// Registration Page
app.get('/register', (req, res) => {
  res.render('register');
});

// Registration Logic
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,8}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).send('Password must be 6-8 characters, include a lowercase letter, an uppercase letter, and a number.');
    }

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    res.status(500).send('Error registering user.');
  }
});

// Login Page
app.get('/login', (req, res) => {
  res.render('login');
});

// Login Logic
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid email or password.');
    }

    // Token-based authentication
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    // Secure, HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.redirect('/secrets');
  } catch (err) {
    res.status(500).send('Error logging in.');
  }
});

// Protected Route
app.get('/secrets', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect('/login');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.redirect('/login');
    }

    res.render('secrets', { user });
  } catch (err) {
    res.redirect('/login');
  }
});

// Logout Route
app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});