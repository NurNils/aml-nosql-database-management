var mongoose = require('mongoose');

/** File Schema */
const FILE_SCHEMA = mongoose.Schema({
    base64: String,
    name: {
        type: String,
        index: {
            unique: true
        }
    },
    type: String,
    size: Number,
    date: Date
});

const FILE = module.exports = mongoose.model('File', FILE_SCHEMA);

/** Get files */
module.exports.getFiles = (callback, limit) => {
    FILE.find(callback).limit(limit);
};

/** Delete file */
module.exports.deleteFile = (_id, callback) => {
    FILE.remove({ _id }, callback);
};

/** Get file */
module.exports.getFile = (_id, callback) => {
    FILE.findOne({ _id }, callback);
};

/** Add file */
module.exports.addFile = (file, callback) => {
    if(file._id == null) {
        file._id = new mongoose.mongo.ObjectID();
    }
    if(file.date == null) {
        file.date = new Date();
    }
    FILE.create(file, callback);
};

/** Update file */
module.exports.updateFile = (_id, file, options, callback) => {
    const update = {
      base64: file.base64,
      name: file.name,
      size: file.size,
      type: file.type,
      date: file.date
    };
    FILE.findOneAndUpdate({ _id }, update, options, callback);
};