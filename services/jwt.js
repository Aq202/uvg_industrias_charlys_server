import jwt from 'jsonwebtoken';
import moment from 'moment';
import config from 'config';
import consts from '../utils/consts.js';

const jwtKey = config.get('jwtKey');

const key = jwtKey;

const signRefreshToken = async ({
  userId, name, lastName, sex, role, organization,
}) => jwt.sign({
  userId,
  name,
  lastName,
  sex,
  role,
  organization,
  exp: moment().add(1, 'week').unix(),
  type: consts.token.refresh,
}, key);

const signAccessToken = ({
  userId, name, lastName, sex, role, organization,
}) => jwt.sign({
  userId,
  name,
  lastName,
  sex,
  role,
  organization,
  exp: moment().add(1, 'day').unix(),
  type: consts.token.access,
}, key);

const signRegisterToken = ({
  id, name, lastName, email,
}) => jwt.sign(
  {
    id,
    name,
    lastName,
    email,
    exp: moment().add(6, 'month').unix(),
    type: consts.token.register,
  },
  key,
);

const validateToken = (token) => jwt.verify(token, key);

export {
  signAccessToken, signRefreshToken, validateToken, signRegisterToken,
};
