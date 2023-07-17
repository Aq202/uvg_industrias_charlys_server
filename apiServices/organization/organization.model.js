import query from '../../database/query.js';
import CustomError from '../../utils/customError.js';

const getClients = async ({ idOrganization, page }) => {
  const rows = page * 10;
  const sql = 'select * from user_account where id_client_organization = $1 LIMIT 11 OFFSET $2';

  const { result, rowCount } = await query(sql, idOrganization, rows);

  if (rowCount === 0) throw new CustomError('No se encontraron resultados.', 404);

  return result.map((val) => ({
    name: val.name,
    lastname: val.lastname,
    email: val.email,
    phone: val.phone,
    sex: val.sex,
  }));
};

export {
  // eslint-disable-next-line import/prefer-default-export
  getClients,
};
