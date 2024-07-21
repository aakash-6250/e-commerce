var express = require('express');
const User = require('../models/user.model');
const Address = require('../models/address.model');
const passport = require('passport');
const LocalStrategy = require('passport-local');
var router = express.Router();
const errorHandler = require('../middleware/errorHandler');

router.use(errorHandler);

passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));

router.post('/register', isLogedOut, async (req, res, next) => {
  try {
    const { password, firstName, lastName, email, phone } = req.body;

    if (!password || !firstName || !lastName || !phone || !email) {
      return res.status(400).json({ message: 'All fields are required.', type: 'error' });
    }

    const user = new User({ firstName, lastName, email, phone });
    await User.register(user, password);

    res.status(200).json({ message: 'User registered successfully.', type: 'success', redirect: '/login' });
  } catch (err) {
    if (err.name === 'MongoServerError' && err.code === 11000) {
      res.status(400).json({ message: 'Email is already registered.', type: 'error' });
    } else {
      console.error(err);
      res.status(500).json({ message: 'Server error occurred during registration.', type: 'error' });
    }
  }
});

router.post('/login', isLogedOut, async (req, res, next) => {
  try {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', type: 'error' });
      }
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.', type: 'error' });
      }
      req.logIn(user, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Server error', type: 'error' });
        }
        if (user.role !== 'admin') {
          return res.status(200).json({ message: 'Login successful', type: 'success', redirect: '/' });
        }
        res.status(200).json({ message: 'Login successful', type: 'success', redirect: '/admin/dashboard' });
      });
    })(req, res, next);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error occurred during login.', type: 'error' });
  }
});

router.post('/:id/update', isLoggedIn, async (req, res, next) => {
  try {
    const { firstName, lastName, phone, addressLabel, addressStreet, addressCity, addressState, addressZip, addressCountry, oldPassword, newPassword } = req.body;
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

    if (addressLabel || addressStreet || addressCity || addressState || addressZip || addressCountry) {
      if (!addressLabel || !addressStreet || !addressCity || !addressState || !addressZip || !addressCountry) throw new Error('All address fields are required.');
      const addressExist = await Address.findById(user.address);
      if (!addressExist) {
        const address = new Address({
          user: user._id,
          addresses: [{
            label: addressLabel,
            street: addressStreet,
            city: addressCity,
            state: addressState,
            zip: addressZip,
            country: addressCountry
          }]
        });
        user.address = address._id;
        await address.save();
      } else {
        addressExist.addresses.push({
          label: addressLabel,
          street: addressStreet,
          city: addressCity,
          state: addressState,
          zip: addressZip,
          country: addressCountry
        });
        user.address = addressExist._id;
        await addressExist.save();
      }

    }

    if(oldPassword || newPassword){
      if(!oldPassword || !newPassword) throw new Error('Old password and new password both are required.')
      await user.changePassword(oldPassword, newPassword);
    }

    
    await user.save();
    res.json({ status: true, message: 'User updated successfully.', user })
  } catch (err) {
    console.error(err);
    res.json({ status: false, message: err.message })
  }
});

router.post('/:id/delete', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw new Error('User not found.');
    await Address.findByIdAndDelete(user.address);
    res.json({ status: true, message: 'User deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.json({ status: false, message: error.message });
  }
});

router.get('/logout', isLoggedIn, (req, res, next)=>{
  req.logout();
  res.json({status: true, message: 'Logout successful.'});
});





function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'You need to login first.', type: 'warning', redirect: '/login' });
}

function isLogedOut(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'You are already logged in.', type: 'warning', redirect: '/' })
}


module.exports = router;
