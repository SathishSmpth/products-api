const multer = require('multer');
var storage = multer.memoryStorage()
var upload = multer({
    storage: storage,
    limits: { fileSize: 500 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
          cb(null, true);
        } else {
          cb(null, false);
          return cb('Only .png, .jpg, .gif and .jpeg format allowed!');
        }
      }
});

module.exports = upload;