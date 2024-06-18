var express = require('express');
const User = require('../models/user.model');
const Address = require('../models/address.model');
const passport = require('passport');
const LocalStrategy = require('passport-local');
var router = express.Router();

passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));

router.post('/register', isLogedOut, async (req, res, next) => {
  try {
    const { password, firstName, lastName, email, phone } = req.body;
    if (!password || !firstName || !lastName || !phone || !email) throw new Error('All fields are required.');
    const user = await User.register(new User({ firstName, lastName, email, phone }), password);
    res.json({ status: true, message: 'User registered successfully.' })
  } catch (err) {
    console.error(err);
    res.json({ status: false, message: err.message })
  }
});

router.post('/login', isLogedOut, async (req, res, next) => {
  try {
    passport.authenticate('local', (err, user, info) => {
      if (err) throw err;
      if (!user) return res.json({ status: false, message: 'Invalid credentials' });
      req.logIn(user, (err) => {
        if (err) throw err;
        res.json({ status: true, message: 'Login successful', user: user });
      });
    })(req, res, next);
  } catch (err) {
    console.error(err);
    res.json({ status: false, message: err.message });
  }
});

router.get('/:id', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new Error('User not found.');
    res.json({ status: true, user });
  } catch (err) {
    console.error(err);
    res.json({ status: false, message: err.message });
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
  res.redirect('/user/login');
}

function isLogedOut(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/user/profile');
}


module.exports = router;
