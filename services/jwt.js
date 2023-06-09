import jwt from 'jsonwebtoken';
import moment from 'moment';
import consts from '../utils/consts.js';
import { jwtKey } from '../config/index.js';

const key = jwtKey;

const signRefreshToken = async ({
  userId, name, lastName, sex, role,
}) => jwt.sign({
  userId,
  name,
  lastName,
  sex,
  role,
  exp: moment().add(1, 'week').unix(),
  type: consts.token.refresh,
}, key);

const signAccessToken = ({
  userId, name, lastName, sex, role,
}) => jwt.sign({
  userId,
  name,
  lastName,
  sex,
  role,
  exp: moment().add(1, 'day').unix(),
  type: consts.token.access,
}, key);

const validateToken = async (token) => jwt.verify(token, key);

export { signAccessToken, signRefreshToken, validateToken };
