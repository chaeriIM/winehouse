/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
const createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose');

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv').config();

const port = process.env.PORT;
const mongodbUrl = process.env.MONGODB_URL;

// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');
const viewsRouter = require('./routes/views');
const categoryRouter = require('./routes/category');

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

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/', viewsRouter);
app.use('/category', categoryRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json(err.message);
  res.render('error');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
