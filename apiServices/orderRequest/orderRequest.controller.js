import fs from 'fs';
import { begin, commit, rollback } from '../../database/transactions.js';
import uploadFileToBucket from '../../services/cloudStorage/uploadFileToBucket.js';
import consts from '../../utils/consts.js';
import CustomError from '../../utils/customError.js';
import randomString from '../../utils/randomString.js';
import { addOrderRequestMedia, getOrderRequests, newOrderRequest } from './orderRequest.model.js';

const newOrderRequestController = async (req, res) => {
  const {
    name, email, phone, address, description,
  } = req.body;

  try {
    begin(); // begin transaction

    const { id } = await newOrderRequest({
      name, email, phone, address, description,
    });

    // save files
    if (Array.isArray(req.uploadedFiles)) {
      let uploadError = false;
      const promises = [];

      for (const file of req.uploadedFiles) {
        const filePath = `${global.dirname}/files/${file.fileName}`;

        // subir archivos
        if (!uploadError) {
          const fileId = `${id}-${randomString(15)}-${Date.now()}.${file.type}`;
          const fileKey = `${consts.bucketRoutes.orderRequest}/${fileId}`;

          try {
            // eslint-disable-next-line no-await-in-loop
            await uploadFileToBucket(fileKey, filePath, file.type);

            // save file url in db
            promises.push(addOrderRequestMedia(id, fileKey));
          } catch (ex) {
            uploadError = true;
          }
        }

        // eliminar archivos temporales

        fs.unlink(filePath, () => {
        });
      }

      await Promise.all(promises);

      if (uploadError) {
        rollback();
        throw new CustomError('No se pudieron guardar imagenes en el servidor.', 500);
      }
    }

    commit();

    res.send({ id });
  } catch (ex) {
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

// eslint-disable-next-line import/prefer-default-export
export { newOrderRequestController, getOrderRequestsController };
