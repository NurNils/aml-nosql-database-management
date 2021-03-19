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
      let dataSource = [];
      files.forEach((f, i) => {
        dataSource.push({id: i+1, _id: f._id , name: f.name, date: f.date, size: f.size});
      });
      
      res.status(200).send({ status: 'success', data: dataSource });
    } else {
      res.status(200).send({ status: 'error', message: 'Unable to get files' });
    }
  });
});
 
app.post('/file', (req, res) => {
  const file = req.body.file;

  if (file && file.base64 && file.name && file.size) {
    const availableFileTypes = process.env.ALLOWED_FILES.split(',');
    if(!file.type) {
      file.type = 'application/xml';
    }
    if (availableFileTypes.includes(`.${file.name.split('.').pop().toLowerCase()}`)) {
      file.size = Buffer.from(file.base64.split(',')[1], 'base64').length;
      file.base64 = file.base64.split(',')[1];
      FILE.addFile(file, (err, savedFile) => {
        if (!err && savedFile) {
          savedFile.base64 = null;
          res.status(200).send({ status: 'success', data: savedFile });
        } else {
          console.log(err.message)
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
      let newObj = {name: file.name, content: Buffer(file.base64, 'base64').toString('ascii')}
      res.status(200).send({ status: 'success', data: newObj });
    } else {
      res.status(200).send({ status: 'error', message: 'Unable to get file' });
    }
  });
});

app.get(`/file/:id/download`, (req, res) => {
  FILE.getFile(req.params.id, (err, file) => {
    if (!err && file) {
      res.status(200).send({status: 'success', data: file});
    } else {
      res.status(200).send({status: 'error', message: 'Unable to download file'});
    }
  });
});
 
app.put('/file/:id', (req, res) => {
  let file = req.body.file;
  file.base64 = new Buffer(file.content).toString('base64');
  delete file.content;
  file.date = new Date();
  file.size = Buffer.from(file.base64, 'base64').length;
  FILE.updateFile(
    req.params.id,
    file,
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
  res.redirect('https://lmf.software/info');
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
