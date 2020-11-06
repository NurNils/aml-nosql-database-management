var mongoose = require('mongoose');

/** File Schema */
const FILE_SCHEMA = mongoose.Schema({
    name: String,
    content: String
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

/** Get file by _id */
module.exports.getFileById = (_id, callback) => {
    FILE.findOne({ _id }, callback);
};

/** Add file */
module.exports.addFile = (file, callback) => {
    if(file._id == null) {
        file._id = new mongoose.mongo.ObjectID();
    }
    FILE.create(file, callback);
};

/** Update file by _id */
module.exports.updateFileById = (_id, file, options, callback) => {
    const update = {
      name: file.name,
      content: file.content
    };
    FILE.findOneAndUpdate({ _id }, update, options, callback);
};