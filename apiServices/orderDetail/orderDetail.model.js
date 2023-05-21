import query from '../../database/query.js';
import CustomError from '../../utils/customError.js';

const newOrderDetail = async ({
  noOrder, product, size, quantity,
}) => {
  const sql = 'INSERT INTO order_detail values($1,$2,$3,$4) RETURNING no_order as id;';

  try {
    const { result, rowCount } = await query(
      sql,
      noOrder,
      product,
      size,
      quantity,
    );

    if (rowCount !== 1) throw new CustomError(`No se pudo agregar el elemento a la orden ${noOrder}`, 500);

    return result[0];
  } catch (err) {
    if (err instanceof CustomError) throw err;
    const { code } = err;
    let error = 'Datos no válidos.';
    if (code === '23505') {
      error = 'Este producto ya se ha agregado a la orden especificada.';
    }

    throw new CustomError(error, 400);
  }
};

const getOrderDetails = async (noOrder, searchQuery) => {
  let queryResult;
  if (searchQuery) {
    const sql = `select od.no_order, pt.name product, prod.client client_id, co.name client,
                prod.color, s.size, od.quantity from order_detail od
                inner join product prod on od.product = prod.id_product
                inner join product_type pt on prod.type = pt.id_product_type
                inner join client_organization co on prod.client = co.id_client_organization
                inner join "size" s on od.size = s.id_size
                where no_order = $1
                AND (pt.name ilike $2 or client ilike $2 or color ilike $2)`;
    queryResult = await query(sql, noOrder, `%${searchQuery}%`);
  } else {
    const sql = `select od.no_order, pt.name product, prod.client client_id, co.name client,
                prod.color, s.size, od.quantity from order_detail od
                inner join product prod on od.product = prod.id_product
                inner join product_type pt on prod.type = pt.id_product_type
                inner join client_organization co on prod.client = co.id_client_organization
                inner join "size" s on od.size = s.id_size
                where no_order = $1`;
    queryResult = await query(sql, noOrder);
  }

  const { result, rowCount } = queryResult;

  if (rowCount === 0) throw new CustomError('No se encontraron resultados.', 404);

  return result.map((val) => ({
    order: val.no_order,
    product: val.product,
    client_id: val.client_id,
    client: val.client,
    color: val.color,
    quantity: val.quantity,
  }));
};

export { getOrderDetails, newOrderDetail };
