const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoute = require('./routes/userRoute');
const errorHandler = require('./middleWare/errorMiddleware');

const cookieParser = require('cookie-parser');

const app = express();
// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Routes Middleware

app.use('/api/users', userRoute);

// routes
app.get('/', (req, res) => {
  res.send('Home page');
});

const PORT = process.env.PORT || 5000;
// Error Middleware

app.use(errorHandler);

// connect to db and start server

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server Running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
