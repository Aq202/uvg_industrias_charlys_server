const parseObjectBodyProp = (key) => (req, res, next) => {
  req.body[key] = JSON.parse(req.body[key]);
  next();
};

export default parseObjectBodyProp;
