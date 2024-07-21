var express = require('express');
const User = require('../models/user.model');
const passport = require('passport');
const LocalStrategy = require('passport-local');
var router = express.Router();

passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));

router.get('/dashboard', isLoggedIn, async (req, res, next) => {
    try {
        res.render('admin/dashboard', { user: req.user });
    } catch (error) {
        console.error(error);
        req.session.errorMessage = error.message;
        req.session.messageType = "error";
        res.redirect(req.headers.referer || '/');
    }
});

router.post('/add-admin', isLoggedIn, async (req, res, next) => {
    try {
        const { password, firstName, lastName, email, phone } = req.body;
        if (!password || !firstName || !lastName || !phone || !email) throw new Error('All fields are required.');
        const user = await User.register(new User({ firstName, lastName, email, phone, role: "admin" }), password);
        res.json({ status: true, message: 'User registered successfully.' })
    } catch (err) {
        console.error(err);
        res.json({ status: false, message: err.message })
    }
});

router.post('/add-admin/secret-token-method', isLogedOut, async (req, res, next) => {
    try {
        const { password, firstName, lastName, email, phone, token } = req.body;
        if (!password || !firstName || !lastName || !phone || !email || !token) throw new Error('All fields are required.');
        if (token !== process.env.SECRET_TOKEN) throw new Error('Invalid token');
        const user = await User.register(new User({ firstName, lastName, email, phone, role: "admin" }), password);
        res.json({ status: true, message: 'User registered successfully.' })
    } catch (err) {
        console.error(err);
        res.json({ status: false, message: err.message })
    }
});

router.post('/delete-admin/:id', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) throw new Error('User not found.');
        res.json({ status: true, message: 'User deleted successfully.' });
    } catch (err) {
        console.error(err);
        res.json({ status: false, message: err.message });
    }
});

router.get('/all-admins', isLoggedIn, async (req, res, next) => {
    try {
        const users = await User.find({ role: 'admin' });
        res.json({ status: true, users });
    } catch (err) {
        console.error(err);
        res.json({ status: false, message: err.message });
    }
});

router.post('/:id/update', isLoggedIn, async (req, res, next) => {
    try {
        const { firstName, lastName, phone, oldPassword, newPassword } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) throw new Error('User not found.');
        if (firstName || lastName) {
            if (!firstName || !lastName) throw new Error('First name and last name are required.');
            user.firstName = firstName;
            user.lastName = lastName;
        }

        if (phone) {
            user.phone = phone;
        }

        if (oldPassword || newPassword) {
            if (!oldPassword || !newPassword) throw new Error('Old password and new password both are required.')
            await user.changePassword(oldPassword, newPassword);
        }


        await user.save();
        res.json({ status: true, message: 'User updated successfully.', user })
    } catch (err) {
        console.error(err);
        res.json({ status: false, message: err.message })
    }
});





function isLoggedIn(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
      return next();
    }
    req.session.errorMessage = "You need to login first";
    req.session.messageType = "error";
    res.redirect(req.headers.referer || '/');
  }
  
  function isLogedOut(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    req.session.errorMessage = "You are already logged in.";
    req.session.messageType = "error";
    res.redirect(req.headers.referer || '/');
  }

function isLoggedInForAPI(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    res.status(401).json({ message: 'You need to login first.', type: 'warning', redirect: '/login' });
}

function isLogedOutForAPI(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'You are already logged in.', type: 'warning', redirect: '/' })
}


module.exports = router;
