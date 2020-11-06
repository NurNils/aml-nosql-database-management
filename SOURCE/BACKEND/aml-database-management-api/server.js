const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('handlebars');
const request = require('request');
const fs = require('fs');

const app = express();

const dotenv = require('dotenv');
dotenv.config();

const production = process.env.PRODUCTION === 'true';
const port = process.env.PORT;

const FILE = require('./models/file');

/**********************
 * Config / Preperation
 **********************/

app.use(bodyParser.json({limit: '12mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '12mb', extended: true}));
app.use(bodyParser.json());


/** Origins */
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Content-Type', 'application/json');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

/**********************
 * Routes
 **********************/

/** Routes */ 
app.get('/file', (req, res) => {
  FILE.getFiles((err, data) => {

  });
  res.send({ status: 'success', code: 200, message: 'blabla' });
});
 
app.post('/file', (req, res) => {

  res.end();
});

app.get('/file/:id', (req, res) => {

  res.end();
});
 
app.put('/file/:id', (req, res) => {

  res.end();
});

app.delete('/file/:id', (req, res) => {

  res.end();
});

/** Default */
app.get('/', (req, res) => {
  res.redirect('https://lmf.software');
  res.end();
});

/**********************
 * Init server & connect to db
 **********************/

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

if(production) {
  mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_DOMAIN}:${process.env.DB_PORT}/${process.env.DB_TABLE}?authSource=admin`);
} else {
  mongoose.connect(`mongodb://${process.env.DB_DOMAIN}:${process.env.DB_PORT}/${process.env.DB_TABLE}`);
}

app.listen(port, () => {
  console.log(`Server (Production Mode: ${production}) is running on port ${port}...`);
});
