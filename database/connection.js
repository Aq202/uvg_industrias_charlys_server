import pgPkg from 'pg';
import {
  dbUser, dbHost, dbName, dbPassword, dbPort,
} from '../config/index.js';

const { Pool } = pgPkg;

// Coloca aquí tus credenciales
const pool = new Pool({
  user: dbUser,
  host: dbHost,
  database: dbName,
  password: dbPassword,
  port: dbPort,
});

export default pool;
