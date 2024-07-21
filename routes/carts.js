var express = require('express');
var router = express.Router();
const User = require('../models/user.model')
const Product = require('../models/product.model')
const Cart = require('../models/cart.model')


router.post('/add', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if(!productId || !quantity) throw new Error("productId and quantity both are required");
    if(quantity < 1) throw new Error("Quantity should be greater than 0");
    
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (!req.isAuthenticated()) {
      const userId = req.user.id;
      let cart = await Cart.findOne({ user: userId });
      const newCart = new Cart({ user: userId, cartItems: [], totalAmount: 0 });

      const cartItemIndex = cart.cartItems.findIndex(item => item.product._id.toString() === productId);
      if (cartItemIndex !== -1) {
        cart.cartItems[cartItemIndex].quantity += quantity;
      } else {
        cart.cartItems.push({ product: product, quantity });
      }

      cart.totalAmount = cart.cartItems.reduce((total, item) => {
        return total + item.quantity * product.price;
      }, 0);

      await cart.save();

      res.json({ status: true, message: 'Product added to cart', cart, newCart });

    } else {
      if (!req.session.cart) req.session.cart = { cartItems: [], totalAmount: 0 };
      const cart = req.session.cart;

      const cartItemIndex = cart.cartItems.findIndex(item => item.product._id.toString() === productId);
      console.log(cartItemIndex, cart.cartItems, productId)
      if (cartItemIndex !== -1) cart.cartItems[cartItemIndex].quantity += quantity;
      else cart.cartItems.push({ product: product, quantity });

      cart.totalAmount = cart.cartItems.reduce((total, item) => {
        return total + item.quantity * product.price;
      }, 0);

      req.session.cart = cart;
      res.json({ status: true, message: 'Product added to cart', cart });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: err.message });
  }
});



function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.json({ status: false, message: "You need to login first" });
}

function isLogedOut(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.json({ status: false, message: "You are already logged in" })
}

module.exports = router;
