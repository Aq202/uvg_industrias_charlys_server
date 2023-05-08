import app from '../app.js';
import { port } from '../config/default.js';

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Servidor corriendo en puerto ${port}.`);
});
