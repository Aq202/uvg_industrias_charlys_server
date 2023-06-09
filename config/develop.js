import { config } from 'dotenv';
import {
  jwtKey as defaultJwtKey,
  clientId as defaultClientId,
  clientSecret as defaultClientSecret,
  refreshToken as defaultRefreshToken,
  dbHost as defaultDBHost,
  dbUser as defaultDBUser,
  dbPassword as defaultDBPassword,
  dbPort as defaultDBPort,
  awsBucketAccess as defaultAwsBucketAccess,
  awsBucketSecret as defaultAwsBucketSecret,
  bucketName as defaultBucketName,
} from './default.js';

config();

const port = 3000;
const dbHost = defaultDBHost;
const dbName = process.env.DB_DEVELOP_NAME;
const dbUser = defaultDBUser;
const dbPassword = defaultDBPassword;
const dbPort = defaultDBPort;
const allowInsecureConnections = true;
const jwtKey = defaultJwtKey;
const clientId = defaultClientId;
const clientSecret = defaultClientSecret;
const refreshToken = defaultRefreshToken;
const awsBucketAccess = defaultAwsBucketAccess;
const awsBucketSecret = defaultAwsBucketSecret;
const bucketName = defaultBucketName;

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
  awsBucketAccess,
  awsBucketSecret,
  bucketName,
};
