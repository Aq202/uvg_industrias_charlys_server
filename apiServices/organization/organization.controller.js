import CustomError from '../../utils/customError.js';
import {
  newOrganization,
  updateOrganization,
  deleteOrganization,
  getOrganizations,
} from './organization.model.js';

const newOrganizationController = async (req, res) => {
  const {
    name, email, phone, address,
  } = req.body;
  try {
    const organizationId = await newOrganization({
      name, email, phone, address,
    });
    res.send(organizationId);
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
    res.send(id);
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
  const { id } = req.body;
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
  newOrganizationController,
  updateOrganizationController,
  deleteOrganizationController,
  getOrganizationsController,
};
