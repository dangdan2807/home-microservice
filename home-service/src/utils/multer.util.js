const multer = require('multer');
const path = require('path');

module.exports = multer({
    storage: multer.diskStorage({}),
    imageFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if (!ext.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
            req.fileValidationError = 'Chỉ cho phép các tệp hình ảnh!';
            return cb(new Error('Định dạng file không được hỗ trợ'), false);
        }
        cb(null, true);
    },
});
