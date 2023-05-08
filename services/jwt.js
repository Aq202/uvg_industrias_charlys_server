import jwt from 'jsonwebtoken';

import { config } from 'dotenv';

config();

const key = process.env.KEY;

const signToken = async ({
  name, lastName, sex, isAdmin, isDoctor,
}) => jwt.sign({
  name,
  lastName,
  sex,
  isAdmin,
  isDoctor,
}, key);

const validateToken = async (token) => jwt.verify(token, key);

export { signToken, validateToken };
