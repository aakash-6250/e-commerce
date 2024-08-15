const multer = require('multer')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')

function generateFilePath(dirName) {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            const dirPath = path.join(__dirname, "..", "public", "images", dirName);

            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }

            cb(null, dirPath);
        },
        filename: function (req, file, cb) {
            const imageName = uuidv4() + path.extname(file.originalname);
            cb(null, imageName);
        }
    });
}

const multerMiddleware = {};
multerMiddleware.product = multer({ storage: generateFilePath("product") }).array('images', 5);
multerMiddleware.category = multer({ storage: generateFilePath("category") }).single('categoryImage');
multerMiddleware.excel = multer({ storage: generateFilePath("excel") }).single('excelFile');

module.exports = { multerMiddleware };