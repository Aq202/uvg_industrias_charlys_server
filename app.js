import express from 'express';
import routes from './routes/index.js';
import getDirname from './helpers/dirname.js';

const app = express();

global.dirname = getDirname(import.meta.url);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./public'));
app.use(routes);

process.on('unhandledRejection', (error) => {
  // eslint-disable-next-line no-console
  console.log('=== UNHANDLED REJECTION ===', error);
});

export default app;
