const uploadImageController = (req, res) => {
  console.log(req.uploadedFiles);
  res.sendStatus(200);
};

// eslint-disable-next-line import/prefer-default-export
export { uploadImageController };
