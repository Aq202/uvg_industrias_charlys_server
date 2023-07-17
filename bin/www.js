import app from '../app.js';
import config from 'config';

const port = config.get("port");

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Servidor corriendo en puerto ${port}.`);
});
