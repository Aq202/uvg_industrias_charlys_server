import query from '../../database/query.js';
import CustomError from '../../utils/customError.js';

const newOrder = async ({ idOrderRequest }) => {
  const sql = 'insert into "order"(id_order, id_order_request) values(default, $1) RETURNING id_order as id';
  const sql2 = `select ua.email from order_request "or"
    natural join client_organization co
    inner join user_account ua on ua.id_client_organization = "or".id_client_organization
    where id_order_request = $1`;

  try {
    const { result, rowCount } = await query(sql, idOrderRequest);
    const { result: emails } = await query(sql2, idOrderRequest);

    if (rowCount !== 1) throw new CustomError('No se pudo generar la orden.', 500);

    result[0].emails = emails;

    return result[0];
  } catch (ex) {
    if (ex?.code === '23503') { throw new CustomError('La solicitud de pedido no existe.', 400); }
    throw ex;
  }
};

export {
  // eslint-disable-next-line import/prefer-default-export
  newOrder,
};
