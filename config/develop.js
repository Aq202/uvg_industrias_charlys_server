import {
  jwtKey as defaultJwtKey,
  clientId as defaultClientId,
  clientSecret as defaultClientSecret,
  refreshToken as defaultRefreshToken,
} from './default.js';

const port = 3000;
const dbHost = 'localhost';
const dbName = 'industriasCharlys';
const dbUser = 'postgres';
const dbPassword = '2010002322';
const dbPort = 5432;
const allowInsecureConnections = true;
const jwtKey = defaultJwtKey;
const clientId = defaultClientId;
const clientSecret = defaultClientSecret;
const refreshToken = defaultRefreshToken;

export {
  port,
  dbName,
  dbUser,
  dbPassword,
  dbHost,
  dbPort,
  allowInsecureConnections,
  jwtKey,
  clientId,
  clientSecret,
  refreshToken,
};
