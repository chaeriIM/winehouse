/* eslint-disable no-unused-vars */
const multer = require('multer');
const path = require('path');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 1024 * 1024 },
});
  
module.exports = upload.single('image');