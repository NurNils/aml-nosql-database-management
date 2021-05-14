/**
 * Copyright (c) 2021
 *
 * This file descripes the mongo mondel for the files.
 *
 * @author NurNils <inf19161@lehre.dhbw-stuttgart.de>
 * @author NamidM <inf19054@lehre.dhbw-stuttgart.de>
 *
 * Last modified  : 14.05.2021
 */
var mongoose = require('mongoose');

/** File Schema */
const FILE_SCHEMA = mongoose.Schema({
  base64: String,
  id: Number,
  name: {
    type: String,
    index: {
      unique: true,
    },
  },
  type: String,
  size: Number,
  date: Date,
});

const FILE = (module.exports = mongoose.model('File', FILE_SCHEMA));

/** Get files */
module.exports.getFiles = (callback, limit) => {
  FILE.find(callback).limit(limit).sort({ date: -1 });
};

/** Delete file */
module.exports.deleteFile = (_id, callback) => {
  FILE.deleteOne({ _id }, callback);
};

/** Get file */
module.exports.getFile = (_id, callback) => {
  FILE.findOne({ _id }, callback);
};

/** Add file */
module.exports.addFile = (file, callback) => {
  if (file._id == null) {
    file._id = new mongoose.mongo.ObjectID();
  }
  if (file.date == null) {
    file.date = new Date();
  }
  FILE.find((err, file2) => {
    if (err || file2.length == 0) {
      file.id = 1;
    } else {
      file.id = file2[0].id + 1;
    }
    FILE.create(file, callback);
  })
    .limit(1)
    .sort({ $natural: -1 });
};

/** Update file */
module.exports.updateFile = (_id, file, options, callback) => {
  const update = {
    base64: file.base64,
    name: file.name,
    size: file.size,
    type: file.type,
    date: file.date,
  };
  FILE.findOneAndUpdate({ _id }, update, options, callback);
};
