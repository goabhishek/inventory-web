const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Plese add a email'],
      unique: true,
      trim: true,
      match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Plaease enter passsword'],
      minLenght: [6, 'password must be up to 6 char.'],
      //   maxLength: [23, 'Password must not be more than  23 char, '],
    },
    photo: {
      type: String,
      required: [true, 'Please add a photo'],
      default: 'https://res.cloudinary.com/mabhi8251/image/upload/v1669205360/Gloitel-fitness/userPic_xntz2o.png',
    },
    phone: {
      type: String,
      required: true,
      default: '+91',
    },
    bio: {
      type: String,
      default: 'bio',
      maxLength: [250, 'Password must not be more than  250 char, '],
    },
  },
  {
    timestamps: true,
  }
);
//Encrypt password before saving to DB
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    return next();
  }
  // Hash password

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
