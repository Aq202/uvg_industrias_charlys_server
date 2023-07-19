import query from '../../database/query.js';
import CustomError from '../../utils/customError.js';

const newOrganization = async ({
  name, email, phone, address,
}) => {
  try {
    const sql = `INSERT INTO client_organization(name, email, phone, address) VALUES ($1, $2, $3, $4)
                RETURNING id_client_organization AS id`;

    const { result, rowCount } = await query(sql, name, email, phone, address);
    if (rowCount !== 1) throw new CustomError('Ocurrió un error al insertar la organización.', 500);

    return result[0].id;
  } catch (ex) {
    if (ex instanceof CustomError) throw ex;
    throw ex;
  }
};

const updateOrganization = async ({
  id, name, email, phone, address,
}) => {
  try {
    const sql = `UPDATE client_organization SET name = $2, email = $3, phone = $4, address = $5
                        WHERE id_client_organization = $1`;
    const { rowCount } = await query(sql, id, name, email, phone, address);
    if (rowCount !== 1) throw new CustomError('No se encontró la organización.', 400);
  } catch (ex) {
    if (ex instanceof CustomError) throw ex;
    throw ex;
  }
};

const deleteOrganization = async ({ id }) => {
  try {
    const sql = 'DELETE FROM client_organization WHERE id_client_organization = $1';
    const { rowCount } = await query(sql, id);
    if (rowCount !== 1) throw new CustomError('No se encontró la organización.', 400);
  } catch (ex) {
    if (ex?.code === '23503') {
      const sqlDisable = 'UPDATE client_organization SET enabled = false WHERE id_client_organization = $1';
      query(sqlDisable, id);
    } else throw ex;
  }
};

const getOrganizations = async ({ page }) => {
  const sql1 = 'SELECT COUNT(*) FROM client_organization';
  const { result: resultCount, rowCount: rowCount1 } = await query(sql1);
  if (rowCount1 === 0) throw new CustomError('No se encontraron resultados.', 404);
  const sql2 = `SELECT * FROM client_organization ORDER BY id_client_organization LIMIT 11 OFFSET ${(page - 1) * 10}`;
  const { result, rowCount: rowCount2 } = await query(sql2);
  if (rowCount2 === 0) throw new CustomError('No se encontraron resultados.', 404);
  const response = result.map((val) => ({
    id: val.id_client_organization,
    name: val.name,
    email: val.email,
    phone: val.phone,
    address: val.address,
    enabled: val.enabled,
  }));
  return { result: response, count: resultCount[0].count };
};

export {
  newOrganization,
  updateOrganization,
  deleteOrganization,
  getOrganizations,
};
