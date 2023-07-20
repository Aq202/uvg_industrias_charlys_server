import CustomError from '../../utils/customError.js';
import {
  newOrganization,
  updateOrganization,
  deleteOrganization,
  getOrganizations,
  getClients,
  getOrderRequests,
} from './organization.model.js';

const getOrderRequestsController = async (req, res) => {
  const { idClient } = req.params;
  const { page, search } = req.query;
  try {
    const result = await getOrderRequests({ idClient, page, search });

    res.send(result);
  } catch (ex) {
    let err = 'Ocurrio un error al obtener las solicitudes de orden de este cliente.';
    let status = 500;
    if (ex instanceof CustomError) {
      err = ex.message;
      status = ex.status;
    }
    res.statusMessage = err;
    res.status(status).send({ err, status });
  }
};

const getClientsController = async (req, res) => {
  const { idOrganization } = req.params;
  const { page, search } = req.query;
  try {
    const result = await getClients({ idOrganization, page, search });

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

const newOrganizationController = async (req, res) => {
  const {
    name, email, phone, address,
  } = req.body;
  try {
    const organizationId = await newOrganization({
      name, email, phone, address,
    });
    res.send({ id: organizationId });
  } catch (ex) {
    let err = 'La información ingresada no es válida al registrar la organización.';
    let status = 500;
    if (ex instanceof CustomError) {
      err = ex.message;
      status = ex.status;
    }
    res.statusMessage = err;
    res.status(status).send({ err, status });
  }
};

const updateOrganizationController = async (req, res) => {
  const {
    id, name, email, phone, address,
  } = req.body;
  try {
    await updateOrganization({
      id, name, email, phone, address,
    });
    res.send({ id });
  } catch (ex) {
    let err = 'La información ingresada no es válida al actualizar la organización.';
    let status = 500;
    if (ex instanceof CustomError) {
      err = ex.message;
      status = ex.status;
    }
    res.statusMessage = err;
    res.status(status).send({ err, status });
  }
};

const deleteOrganizationController = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteOrganization({ id });
    res.send(id);
  } catch (ex) {
    let err = 'No se encontró el id de la organización';
    let status = 500;
    if (ex instanceof CustomError) {
      err = ex.message;
      status = ex.status;
    }
    res.statusMessage = err;
    res.status(status).send({ err, status });
  }
};

const getOrganizationsController = async (req, res) => {
  const { page } = req.query;
  try {
    const result = await getOrganizations({ page });
    res.send(result);
  } catch (ex) {
    let err = 'Ocurrio un error al obtener las organizaciones.';
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
  getOrderRequestsController,
  newOrganizationController,
  updateOrganizationController,
  deleteOrganizationController,
  getOrganizationsController,
};
