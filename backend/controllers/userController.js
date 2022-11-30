const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
User;
const jwt = require('jsonwebtoken');
const { response } = require('express');
const bcrypt = require('bcryptjs');

// Generate token
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
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

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

  if (user && passwordIsCorrect) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
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
    throw new Error('Invalid email or password');
  }
});

//Logout User

const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    path: '/',
    httpOnly: true,
    expires: new Date(0),
    sameSite: 'none',
    secure: true,
  });

  return res.status(200).json({ message: 'Successfully Logget Out' });
});

// get user Data

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findOne(req.user._id);

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
    });
  } else {
    res.status(400);
    throw new Error('User not found');
  }
});

//get login Status
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }

  // Verify Token
  const verified = jwt.verify(token, process.env.JWT_SECRET);

  if (verified) {
    return res.json(true);
  }
  return res.json(false);
});

//Update User

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { name, email, photo, phone, bio } = user;
    user.email = email;
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;
    user.photo = req.body.photo || photo;

    const updatesUser = await user.save();
    res.status(200).json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      photo: updateUser.photo,
      phone: updateUser.phone,
      bio: updateUser.bio,
    });
  }
});

// Change password

const ChagePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  const { oldPassword, password } = req.body;
  if (!user) {
    res.status(400);
    throw new Error('User Not found,please signup');
  }
  // validate
  if (!oldPassword || !password) {
    res.status(400);
    throw new Error('Please old and new password');
  }

  // check if password is matches password in DB

  const passswordIsCorrect = await bcrypt.compare(oldPassword, user.password);

  // Save new password

  if (user && passswordIsCorrect) {
    user.password = password;
    await user.save();
    res.status(200).send('password change successful');
  } else {
    res.status(400);
    throw new Error('Old password is incorrect');
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  res.send('forgot password');
});

module.exports = {
  registerUser,
  loginUser,
  logout,
  getUser,
  loginStatus,
  updateUser,
  ChagePassword,
  forgotPassword,
};
