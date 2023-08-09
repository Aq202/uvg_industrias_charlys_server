import query from '../../database/query.js';
import consts from '../../utils/consts.js';
import CustomError from '../../utils/customError.js';

const newOrderRequest = async ({
  description,
  idClientOrganization = null,
  idTemporaryClient = null,
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
      if (ex.detail?.includes('id_client_organization')) { throw new CustomError('La organización cliente no existe.', 400); }
      if (ex.detail?.includes('id_temporary_client')) { throw new CustomError('El cliente temporal no existe.', 400); }
    }
    throw ex;
  }
};

const newOrderRequestRequirement = async ({
  idOrderRequest, idProductModel, size, quantity,
}) => {
  const sql = `INSERT INTO order_request_requirement(id_order_request, id_product_model, "size", quantity)
                VALUES ($1, $2, $3, $4)`;

  try {
    const { result, rowCount } = await query(sql, idOrderRequest, idProductModel, size, quantity);

    if (rowCount !== 1) {
      throw new CustomError(
        'No se pudo registrar el requerimiento para la solicitud de orden.',
        500,
      );
    }

    return result[0];
  } catch (ex) {
    if (ex?.code === '23514') throw new CustomError('El modelo del producto no pertenece a esta organización.', 400);
    if (ex?.code === '23505') throw new CustomError('No se permiten requerimientos duplicados con el mismo modelo de producto y talla.', 400);
    if (ex?.code === '23503') {
      if (ex.detail?.includes('id_order_request')) { throw new CustomError('La solicitud de orden no existe.', 400); }
      if (ex.detail?.includes('id_product_model')) { throw new CustomError('El modelo de producto no existe.', 400); }
      if (ex.detail?.includes('size')) { throw new CustomError('La talla proporcionada no existe.', 400); }
    }
    throw ex;
  }
};

const updateOrderRequest = async ({
  idOrderRequest, description, deadline, cost, details,
}) => {
  const sqlGet = 'select * from order_request where id_order_request = $1;';
  const { result: resultGet, rowCount: rowCountGet } = await query(sqlGet, idOrderRequest);

  if (rowCountGet === 0) { throw new CustomError('No se han encontrado registros con el id proporcionado.', 404); }

  const sqlUpdate = `update order_request set description = $1, deadline = $2,
    cost = $3, aditional_details = $4 where id_order_request = $5`;
  await query(
    sqlUpdate,
    description || resultGet[0].description,
    deadline || resultGet[0].deadline,
    cost || resultGet[0].cost,
    details || resultGet[0].aditional_details,
    idOrderRequest,
  );
};

const getOrderRequests = async (searchQuery) => {
  let queryResult;
  if (searchQuery) {
    const sql = `
      SELECT * FROM (
      SELECT O.*, CO.name AS client FROM order_request O
      INNER JOIN client_organization CO ON O.id_client_organization = CO.id_client_organization
      UNION
      SELECT O.*, TC.name AS client FROM order_request O
      INNER JOIN temporary_client TC ON O.id_temporary_client = TC.id_temporary_client
      ) AS sub_query
      WHERE client ILIKE $1 OR description ILIKE $1 ORDER BY date_placed DESC
    `;
    queryResult = await query(sql, `%${searchQuery}%`);
  } else {
    queryResult = await query(`
      SELECT O.*, CO.name AS client FROM order_request O
      INNER JOIN client_organization CO ON O.id_client_organization = CO.id_client_organization
      UNION
      SELECT O.*, TC.name AS client FROM order_request O
      INNER JOIN temporary_client TC ON O.id_temporary_client = TC.id_temporary_client
    `);
  }

  const { result, rowCount } = queryResult;

  if (rowCount === 0) throw new CustomError('No se encontraron resultados.', 404);

  return result.map((val) => ({
    id: val.id_order_request,
    client: val.client,
    description: val.description,
    datePlaced: val.date_placed,
    clientOrganization: val.id_client_organization ?? undefined,
    temporaryClient: val.id_temporary_client ?? undefined,
  }));
};

const addOrderRequestMedia = async (orderRequestId, name) => {
  const sql = 'INSERT INTO order_request_media(id_order_request, name) VALUES ($1, $2) ;';

  const { rowCount } = await query(sql, orderRequestId, name);

  if (rowCount !== 1) { throw new CustomError('No se pudo guardar el recurso para la solicitud de orden.', 500); }
};

const getOrderRequestMedia = async (orderRequestId) => {
  const sql = 'SELECT name FROM order_request_media WHERE id_order_request = $1';
  const { result, rowCount } = await query(sql, orderRequestId);

  return rowCount > 0
    ? result.map((val) => `${consts.imagePath.orderRequest}/${val.name}`)
    : null;
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
  newOrderRequest,
  getOrderRequests,
  addOrderRequestMedia,
  getOrderRequestById,
  updateOrderRequest,
  newOrderRequestRequirement,
};
