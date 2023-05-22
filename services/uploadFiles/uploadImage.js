import multer from 'multer';
import CustomError from '../../utils/customError.js';

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, `${global.dirname}/files`);
  },

  filename(req, file, callback) {
    const newFilename = `${Date.now()}-${file.originalname}`;
    if (!Array.isArray(req.uploadedFiles)) req.uploadedFiles = [newFilename];
    else req.uploadedFiles.push(newFilename);
    callback(null, newFilename);
  },
});

const fileFilter = (req, file, callback) => {
  // Check if the file type is an image
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    callback(null, true); // Accept the file
  } else {
    callback(new CustomError('Solo se permiten formatos de imagen JPEG, JPG, y PNG .', 400)); // Reject the file
  }
};

export default multer({ storage, fileFilter });
