import fs from 'fs';
import { begin, commit, rollback } from '../../database/transactions.js';
import uploadFileToBucket from '../../services/cloudStorage/uploadFileToBucket.js';
import consts from '../../utils/consts.js';
import CustomError from '../../utils/customError.js';
import randomString from '../../utils/randomString.js';
import {
  addOrderRequestMedia,
  getOrderRequestById,
  getOrderRequests,
  newOrderRequest,
  newOrderRequestRequirement,
  updateOrderRequest,
} from './orderRequest.model.js';
import { createTemporaryClient } from '../temporaryClient/temporaryClient.model.js';

const saveOrderRequestMedia = async ({ files, id }) => {
  let uploadError = false;
  const promises = [];

  for (const file of files) {
    const filePath = `${global.dirname}/files/${file.fileName}`;

    // subir archivos
    if (!uploadError) {
      const fileId = `${id}-${randomString(15)}-${Date.now()}.${file.type}`;
      const fileKey = `${consts.bucketRoutes.orderRequest}/${fileId}`;

      try {
        // eslint-disable-next-line no-await-in-loop
        await uploadFileToBucket(fileKey, filePath, file.type);

        // save file url in db
        promises.push(addOrderRequestMedia(id, fileId));
      } catch (ex) {
        uploadError = true;
      }
    }

    // eliminar archivos temporales

    fs.unlink(filePath, () => { });
  }

  await Promise.all(promises);

  if (uploadError) {
    await rollback();
    throw new CustomError('No se pudieron guardar imagenes en el servidor.', 500);
  }
};
const newOrderRequestController = async (req, res) => {
  const {
    name, email, phone, address, description,
  } = req.body;

  try {
    begin(); // begin transaction

    const { id: idTemporaryClient } = await createTemporaryClient({
      name,
      email,
      phone,
      address,
    });

    const { id } = await newOrderRequest({
      description,
      idTemporaryClient,
    });

    // save files
    if (Array.isArray(req.uploadedFiles)) {
      await saveOrderRequestMedia({ files: req.uploadedFiles, id });
    }

    await commit();

    res.send({ id });
  } catch (ex) {
    await rollback();
    let err = 'Ocurrio un error al registrar intención de compra.';
    let status = 500;
    if (ex instanceof CustomError) {
      err = ex.message;
      status = ex.status;
    }
    res.statusMessage = err;
    res.status(status).send({ err, status });
  }
};

const updateOrderRequestController = async (req, res) => {
  const {
    description, deadline, cost, details,
  } = req.body;
  const { idOrderRequest } = req.params;

  try {
    begin(); // begin transaction

    await updateOrderRequest({
      idOrderRequest, description, deadline, cost, details,
    });

    // save files
    if (Array.isArray(req.uploadedFiles)) {
      await saveOrderRequestMedia({ files: req.uploadedFiles, idOrderRequest });
    }

    await commit();

    res.send({ idOrderRequest });
  } catch (ex) {
    await rollback();
    let err = 'Ocurrio un error al actualizar la solicitud de pedido.';
    let status = 500;
    if (ex instanceof CustomError) {
      err = ex.message;
      status = ex.status;
    }
    res.statusMessage = err;
    res.status(status).send({ err, status });
  }
};

const newClientOrderRequestController = async (req, res) => {
  const { description, idClientOrganization, products } = req.body;

  try {
    begin(); // begin transaction

    const { id } = await newOrderRequest({
      description,
      idClientOrganization,
    });

    // guardar requerimientos de productos de la orden
    for (const product of products) {
      const { idProductModel, size, quantity } = product;
      // eslint-disable-next-line no-await-in-loop
      await newOrderRequestRequirement({
        idOrderRequest: id, idProductModel, size, quantity,
      });
    }

    // save files
    if (Array.isArray(req.uploadedFiles)) {
      await saveOrderRequestMedia({ files: req.uploadedFiles, id });
    }

    await commit();

    res.send({ id });
  } catch (ex) {
    await rollback();
    let err = 'Ocurrio un error al registrar intención de compra de un cliente ya registrado.';
    let status = 500;
    if (ex instanceof CustomError) {
      err = ex.message;
      status = ex.status;
    }
    res.statusMessage = err;
    res.status(status).send({ err, status });
  }
};

const getOrderRequestsController = async (req, res) => {
  const { search } = req.query;

  try {
    const result = await getOrderRequests(search);

    res.send(result);
  } catch (ex) {
    let err = 'Ocurrio un error al obtener solicitudes de pedido.';
    let status = 500;
    if (ex instanceof CustomError) {
      err = ex.message;
      status = ex.status;
    }
    res.statusMessage = err;
    res.status(status).send({ err, status });
  }
};

const getOrderRequestByIdController = async (req, res) => {
  const { orderRequestId } = req.params;
  try {
    const result = await getOrderRequestById(orderRequestId);
    res.send(result);
  } catch (ex) {
    let err = 'Ocurrio un error al obtener solicitudes de pedido.';
    let status = 500;
    if (ex instanceof CustomError) {
      err = ex.message;
      status = ex.status;
    }
    res.statusMessage = err;
    res.status(status).send({ err, status });
  }
};

// eslint-disable-next-line import/prefer-default-export
export {
  newOrderRequestController,
  getOrderRequestsController,
  getOrderRequestByIdController,
  newClientOrderRequestController,
  updateOrderRequestController,
};
