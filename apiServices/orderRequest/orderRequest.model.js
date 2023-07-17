import query from '../../database/query.js';
import consts from '../../utils/consts.js';
import CustomError from '../../utils/customError.js';

const newOrderRequest = async ({
  description, idClientOrganization = null, idTemporaryClient = null,
}) => {
  const sql = `INSERT INTO order_request(description, date_placed, id_client_organization, id_temporary_client)
                VALUES ($1, now(), $2, $3) RETURNING id_order_request as id;`;

  try {
    const { result, rowCount } = await query(
      sql,
      description,
      idClientOrganization,
      idTemporaryClient,
    );

    if (rowCount !== 1) throw new CustomError('No se pudo registrar la solicitud de orden', 500);

    return result[0];
  } catch (ex) {
    if (ex?.code === '23503') {
      if (ex.detail?.includes('id_client_organization')) throw new CustomError('La organización cliente no existe.', 400);
      if (ex.detail?.includes('id_temporary_client')) throw new CustomError('El cliente temporal no existe.', 400);
    }
    throw ex;
  }
};

const getOrderRequests = async (searchQuery) => {
  let queryResult;
  if (searchQuery) {
    const sql = `select * from order_request WHERE customer_name ILIKE $1 OR customer_email ILIKE $1 OR
                customer_phone ILIKE $1 OR customer_address ILIKE $1 OR description ILIKE $1 ORDER BY date_placed DESC`;
    queryResult = await query(sql, `%${searchQuery}%`);
  } else {
    queryResult = await query('select * from order_request ORDER BY date_placed DESC');
  }

  const { result, rowCount } = queryResult;

  if (rowCount === 0) throw new CustomError('No se encontraron resultados.', 404);

  return result.map((val) => ({
    id: val.id_order_requestt,
    customerName: val.customer_name,
    customerEmail: val.customer_email,
    customerPhone: val.customer_phone,
    customerAddress: val.customer_address,
    description: val.description,
    datePlaced: val.date_placed,
  }));
};

const addOrderRequestMedia = async (orderRequestId, name) => {
  const sql = 'INSERT INTO order_request_media(id_order_request, name) VALUES ($1, $2) ;';

  const { rowCount } = await query(
    sql,
    orderRequestId,
    name,
  );

  if (rowCount !== 1) throw new CustomError('No se pudo guardar el recurso para la solicitud de orden.', 500);
};

const getOrderRequestMedia = async (orderRequestId) => {
  const sql = 'SELECT name FROM order_request_media WHERE id_order_request = $1';
  const { result, rowCount } = await query(sql, orderRequestId);

  return rowCount > 0 ? result.map((val) => `${consts.apiPath}/image/orderRequest/${val.name}`) : null;
};

const getOrderRequestById = async (orderRequestId) => {
  const sql = 'SELECT * FROM order_request WHERE id_order_request = $1 LIMIT 1';
  const { result, rowCount } = await query(sql, orderRequestId);

  if (rowCount === 0) throw new CustomError('No se encontraron resultados.', 404);

  const [val] = result;

  const media = await getOrderRequestMedia(orderRequestId);

  return {
    id: val.id_order_request,
    customerName: val.customer_name,
    customerEmail: val.customer_email,
    customerPhone: val.customer_phone,
    customerAddress: val.customer_address,
    description: val.description,
    datePlaced: val.date_placed,
    media,
  };
};

export {
  newOrderRequest, getOrderRequests, addOrderRequestMedia, getOrderRequestById,
};
