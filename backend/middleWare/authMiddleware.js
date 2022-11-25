const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
User;
const jwt = require('jsonwebtoken');

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401);
      throw new Error('Not authorized,pleaselogin');
    }

    // Verify Token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    //Get the User if from token
    user = await User.findById(verified.id).select('-password');
    if (!user) {
      res.status(401);
      throw new Error('User Not found');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized,pleaselogin');
  }
});
module.exports = protect;
