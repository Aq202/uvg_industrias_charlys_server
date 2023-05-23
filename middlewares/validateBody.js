import fs from 'fs';

export default (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body);
    return next();
  } catch (err) {
    // Eliminar archivos cargados
    const { uploadedFiles } = req;
    if (uploadedFiles !== null && uploadedFiles !== undefined) {
      if (Array.isArray(uploadedFiles)) {
        uploadedFiles.forEach((file) => {
          fs.unlink(`${global.dirname}/files/${file.fileName}`, (error) => {
            // eslint-disable-next-line no-console
            console.log('🚀 ~ file: validateBody.js:15 ~ fs.unlink ~ error:', error);
          });
          return null;
        });
      } else {
        fs.unlink(`${global.dirname}/files/${uploadedFiles.fileName}`, (error) => {
        // eslint-disable-next-line no-console
          console.log('🚀 ~ file: validateBody.js:21 ~ error:', error);
        });
      }
    }
    res.statusMessage = err.message;
    return res.status(400).send({ err: err.message, status: 400, ok: false });
  }
};
