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
  FILE.getFiles((err, files) => {
    if (!err && files) {
      res.status(200).send({ status: 'success', data: files });
    } else {
      res.status(200).send({ status: 'error', message: 'Unable to get files' });
    }
  });
});
 
app.post('/file', (req, res) => {
  const file = req.body.file;

  //TODO: Conversion of file

  if (file && file.base64 && file.name && file.type) {
    const availableFileTypes = FILES_IMAGE.split(',');
    if (availableFileTypes.includes(file.type)) {
      file.size = Buffer.from(file.base64.split(',')[1], 'base64').length;
      FILE.addFile(file, (err, savedFile) => {
        if (!err && savedFile) {
          savedFile.base64 = null;
          res.status(200).send({ status: 'success', data: savedFile });
        } else {
          res.status(200).send({ status: 'error', message: 'Unable to add file' });
        }
      });
    } else {
      res.status(200).send({ status: 'error', message: 'File type is not allowed' });
    }
  } else {
    res.status(200).send({ status: 'error', message: 'No file was uploaded. Please try again' });
  }
});

app.get('/file/:id', (req, res) => {
  FILE.getFile(req.params.id, (err, file) => {
    if (!err && file) {
      res.status(200).send({ status: 'success', data: file });
    } else {
      res.status(200).send({ status: 'error', message: 'Unable to get file' });
    }
  });
});
 
app.put('/file/:id', (req, res) => {
  FILE.updateFile(
    req.params.id,
    req.body.data,
    { new: true },
    (err, file) => {
      if (!err && file) {
        res.status(200).send({ status: 'success', data: file });
      } else {
        res.status(200).send({ status: 'error', message: 'Unable to update file' });
      }
    }
  );
});

app.delete('/file/:id', (req, res) => {
  FILE.deleteFile(req.params.id, (err, file) => {
    if (!err && file) {
      res.status(200).send({ status: 'success', data: file });
    } else {
      res.status(200).send({ status: 'error', message: 'Unable to delete file' });
    }
  });
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
