import { config } from 'dotenv';

config(); // hace accesibles las variables de entorno

const port = 3000;
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbPort = process.env.DB_PORT;
const allowInsecureConnections = true;
const jwtKey = process.env.KEY;
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

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
