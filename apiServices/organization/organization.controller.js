import CustomError from '../../utils/customError.js';
import { getClients } from './organization.model.js';

const getClientsController = async (req, res) => {
  const { idOrganization } = req.params;
  const page = req.query.page || 0;
  try {
    const result = await getClients({ idOrganization, page });

    res.send(result);
  } catch (ex) {
    let err = 'Ocurrio un error al obtener los clientes para esta organización.';
    let status = 500;
    if (ex instanceof CustomError) {
      err = ex.message;
      status = ex.status;
    }
    res.statusMessage = err;
    res.status(status).send({ err, status });
  }
};

export {
  // eslint-disable-next-line import/prefer-default-export
  getClientsController,
};
