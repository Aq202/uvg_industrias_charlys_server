import { config } from 'dotenv';

config();

const port = 3000;
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbPort = process.env.DB_PORT;

export {
  port, dbName, dbUser, dbPassword, dbHost, dbPort,
};
