import query from '../../database/query.js';
import CustomError from '../../utils/customError.js';

const newOrderRequest = async ({
  name, email, phone, address, description,
}) => {
  const sql = `INSERT INTO order_request(customer_name, customer_email, customer_phone, customer_address, description, date_placed)
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING no_request as id;`;

  try {
    const { result, rowCount } = await query(
      sql,
      name,
      email,
      phone,
      address,
      description,
      new Date(),
    );

    if (rowCount !== 1) throw new CustomError('No se pudo registrar la solicitud de orden', 500);

    return result[0];
  } catch (ex) {
    if (ex?.constraint === 'check_email') throw new CustomError('El formato del email es inválido.', 400);
    throw ex;
  }
};

// eslint-disable-next-line import/prefer-default-export
export { newOrderRequest };
