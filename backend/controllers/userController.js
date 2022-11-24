const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
User;
const jwt = require('jsonwebtoken');
const { response } = require('express');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Register

const registerUser = asyncHandler(async (req, res) => {
  //   res.send('Register User');
  const { name, email, password } = req.body;

  //Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }
  if (password.lenght < 6) {
    res.status(400);
    throw new Error('Password is must be upto 6 characters');
  }

  // check if user email already exits
  const userExits = await User.findOne({ email });

  if (userExits) {
    res.status(400);
    throw new Error('Email has already been Used registerd');
  }

  // Create new user

  const user = await User.create({
    name,
    email,
    password,
  });

  //genearet Token

  const token = generateToken(user._id);

  // send HTTP-only cookie

  res.cookie('token', token, {
    path: '/',
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), //1day
    sameSite: 'none',
    secure: true,
  });

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

//Login user

const loginUser = asyncHandler(async (req, res) => {
  //   res.send('Login user');

  const { email, password } = req.body;

  // Validate Request

  if (!email || !password) {
    res.status(400);
    throw new Error('Please add email and password');
  }

  // check if user exists

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error('user not found ,  Please signup');
  }

  // user exists , check if passwoed is correct
});

module.exports = {
  registerUser,
  loginUser,
};
