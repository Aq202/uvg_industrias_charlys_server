import query from '../../database/query.js';
import CustomError from '../../utils/customError.js';

const newOrder = async ({ idOrderRequest }) => {
  const sql = 'insert into "order"(id_order, id_order_request) values(default, $1) RETURNING id_order as id';
  const sql2 = `select ua.email, ua.name from order_request "or"
    natural join client_organization co
    inner join user_account ua on ua.id_client_organization = "or".id_client_organization
    where id_order_request = $1 and ua.enabled = true;`;
  const sql3 = `select pr.name, od.size, od.quantity, od.unit_cost from order_detail od
    natural join "order" o 
    inner join product pr on od.id_product = pr.id_product
    where o.id_order_request = $1;`;
  const sql4 = `select SUM(od.quantity * od.unit_cost) total from order_detail od
    natural join "order" o
    where o.id_order_request = $1;`;

  try {
    const { result: users } = await query(sql2, idOrderRequest);
    const { result, rowCount } = await query(sql, idOrderRequest);
    const { result: detail } = await query(sql3, idOrderRequest);
    const { result: total } = await query(sql4, idOrderRequest);

    if (rowCount !== 1) throw new CustomError('No se pudo generar la orden.', 500);

    result[0].users = users;
    result[0].detail = detail;
    result[0].total = total[0].total;

    return result[0];
  } catch (ex) {
    if (ex?.code === '23503') { throw new CustomError('La solicitud de pedido no existe.', 400); }
    if (ex?.code === '42P02') { throw new CustomError(ex.message, 400); }
    throw ex;
  }
};

export {
  // eslint-disable-next-line import/prefer-default-export
  newOrder,
};
