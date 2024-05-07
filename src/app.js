/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose');

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv').config();

const port = process.env.PORT;
const mongodbUrl = process.env.MONGODB_URL;

const errorMiddleware = require('./middlewares/errorMiddleware');

const viewsRouter = require('./routes/views');
const categoryRouter = require('./routes/category');
const productRouter = require('./routes/product');
const userRouter = require('./routes/users');
const orderRouter = require('./routes/order');

const app = express();

// mongodb connect

mongoose.connect(
  mongodbUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'db',
  },
);

const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to mongodb');
});
db.on('error', (err) => {
  console.log(err);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/', viewsRouter);
app.use('/user', userRouter);
app.use('/category', categoryRouter);
app.use('/product', productRouter);
app.use('/api-order', orderRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;