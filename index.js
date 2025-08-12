// index.js

// 1. Required Packages and Configuration
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // Moved to the top

const app = express();

// 2. App Middleware and Setup
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// 3. Session Middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions'
    }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000 // 1 hour
    }
}));

// 4. Database Connection
mongoose.connect(process.env.MONGO_URI);

// 5. Mongoose Schema and Model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long']
    }
});

const User = mongoose.model("User", userSchema);

// 6. Custom Middleware
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

// 7. Routes
app.get("/", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,8}/.test(password)) {
            return res.render("register", { error: "Password must be 6-8 characters, with at least one uppercase letter, one lowercase letter, and one number." });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.redirect("/login");
    } catch (err) {
        console.log(err);
        let errorMessage = "An error occurred during registration.";
        if (err.code === 11000) {
            errorMessage = "This email is already registered.";
        }
        res.render("register", { error: errorMessage });
    }
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const foundUser = await User.findOne({ email });
        if (!foundUser) {
            return res.render("login", { error: "Invalid email or password." });
        }

        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (isMatch) {
            req.session.user = {
                id: foundUser._id,
                name: foundUser.name,
                email: foundUser.email
            };
            res.redirect("/secrets");
        } else {
            res.render("login", { error: "Invalid email or password." });
        }
    } catch (err) {
        console.log(err);
        res.render("login", { error: "An error occurred during login." });
    }
});

app.get("/secrets", isAuthenticated, (req, res) => {
    res.render("secrets", { user: req.session.user });
});

app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            return res.redirect("/secrets");
        }
        res.clearCookie('connect.sid');
        res.redirect("/login");
    });
});

// 8. Server Listener
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started on port http://localhost:${process.env.PORT || 3000}`);
});