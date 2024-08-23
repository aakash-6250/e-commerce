const multer = require('multer')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const sharp = require('sharp')


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

multerMiddleware.resizeProductImages = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) return next();

        for (let file of req.files) {
            const imageFilename = file.filename.split('.')[0];
            const finalImagePath = path.join(__dirname, '../', 'public', 'images', 'product', `${imageFilename}.webp`);

            const imageStream = fs.createReadStream(file.path);
            const processedImageStream = imageStream.pipe(
                sharp()
                    .rotate()
                    .webp({ quality: 100 })
            );

            const writeStream = fs.createWriteStream(finalImagePath);

            await new Promise((resolve, reject) => {
                processedImageStream.pipe(writeStream);
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });

            // After the image is processed and written, delete the original file
            fs.unlinkSync(file.path);

            // Update the file information in the request object
            file.path = finalImagePath;
            file.filename = `${imageFilename}.webp`;
        }

        next();
    } catch (error) {
        console.error('Image processing failed:', error);
        return res.status(500).json({ error: 'Image processing failed' });
    }
};


multerMiddleware.category = multer({ storage: generateFilePath("category") }).single('categoryImage');
multerMiddleware.excel = multer({ storage: generateFilePath("excel") }).single('excelFile');

module.exports = { multerMiddleware };