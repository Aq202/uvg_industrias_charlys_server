import query from '../../database/query.js';
import consts from '../../utils/consts.js';
import CustomError from '../../utils/customError.js';

const getOrganizationById = async ({ idClient }) => {
  const sqlOrg = 'SELECT * FROM client_organization where id_client_organization = $1;';
  const sqlTemp = 'SELECT * FROM temporary_client where id_temporary_client = $1;';

  let { result, rowCount } = await query(sqlOrg, idClient);

  if (rowCount === 0) {
    ({ result, rowCount } = await query(sqlTemp, idClient));
    if (rowCount === 0) throw new CustomError('No se encontraron resultados.', 404);
  }
  return result.map((val) => ({
    id: val.id_temporary_client || val.id_client_organization,
    name: val.name,
    email: val.email,
    phone: val.phone,
    address: val.address,
  }))[0];
};

const getOrderRequests = async ({ idClient, page = 0, search }) => {
  const offset = page * consts.pageLength;
  if (search === undefined) {
    const sqlCount = 'select ceiling(count(*)/$1::numeric) from order_request where id_client_organization = $2 or id_temporary_client = $2;';
    const sql = 'select * from order_request where id_client_organization = $1 or id_temporary_client = $1 LIMIT $2 OFFSET $3';

    const pages = (await query(sqlCount, consts.pageLength, idClient)).result[0].ceiling;
    const { result, rowCount } = await query(sql, idClient, consts.pageLength, offset);
    if (rowCount === 0) throw new CustomError('No se encontraron resultados.', 404);

    const rows = result.map((val) => ({
      id: val.id_order_request,
      description: val.description,
      date_placed: val.date_placed,
      client: val.id_client_organization || val.id_temporary_client,
      deadline: val.deadline,
      cost: val.cost,
      details: val.aditional_details,
    }));
    return { result: rows, count: pages };
  }
  const sqlCount = `select ceiling(count(*)/$1::numeric) from order_request
  where (id_client_organization = $2 or id_temporary_client = $2)
  and (description ilike'%${search}%' or aditional_details ilike '%${search}%');`;
  const sql = `select * from order_request
  where (id_client_organization = $1 or id_temporary_client = $1)
  and (description ilike'%${search}%' or aditional_details ilike '%${search}%')
  LIMIT $2 OFFSET $3;`;

  const pages = (await query(sqlCount, consts.pageLength, idClient)).result[0].ceiling;
  const { result, rowCount } = await query(sql, idClient, consts.pageLength, offset);
  if (rowCount === 0) throw new CustomError('No se encontraron resultados.', 404);

  const rows = result.map((val) => ({
    id: val.id_order_request,
    description: val.description,
    date_placed: val.date_placed,
    client: val.id_client_organization || val.id_temporary_client,
    deadline: val.deadline,
    cost: val.cost,
    details: val.aditional_details,
  }));
  return { result: rows, count: pages };
};

const getClients = async ({ idOrganization, page = 0, search }) => {
  const offset = page * consts.pageLength;
  if (search === undefined) {
    const sqlCount = 'select ceiling(count(*)/$1::numeric) from user_account where id_client_organization = $2 AND enabled = true';
    const sql = 'select * from user_account where id_client_organization = $1 AND enabled = true LIMIT $2 OFFSET $3';

    const pages = (await query(sqlCount, consts.pageLength, idOrganization)).result[0].ceiling;
    const { result, rowCount } = await query(sql, idOrganization, consts.pageLength, offset);
    if (rowCount === 0) throw new CustomError('No se encontraron resultados.', 404);

    const rows = result.map((val) => ({
      id: val.id_user,
      name: val.name,
      lastname: val.lastname,
      email: val.email,
      phone: val.phone,
      sex: val.sex,
    }));
    return { result: rows, count: pages };
  }
  const sqlCount = `select ceiling(count(*)/$1::numeric) from user_account where id_client_organization = $2
  AND enabled = true
  and ("name" ilike '%${search}%' or lastname ilike '%${search}%' or email ilike '%${search}%'
  or phone ilike '%${search}%');`;
  const sql = `select * from user_account where id_client_organization = $1 AND enabled = true
  and ("name" ilike '%${search}%' or lastname ilike '%${search}%' or email ilike '%${search}%'
  or phone ilike '%${search}%') LIMIT $2 OFFSET $3;`;

  const pages = (await query(sqlCount, consts.pageLength, idOrganization)).result[0].ceiling;
  const { result, rowCount } = await query(sql, idOrganization, consts.pageLength, offset);
  if (rowCount === 0) throw new CustomError('No se encontraron resultados.', 404);

  const rows = result.map((val) => ({
    id: val.id_user,
    name: val.name,
    lastname: val.lastname,
    email: val.email,
    phone: val.phone,
    sex: val.sex,
  }));
  return { result: rows, count: pages };
};

const newOrganization = async ({
  name, email, phone, address,
}) => {
  try {
    const sql = `INSERT INTO client_organization(name, email, phone, address, enabled) VALUES ($1, $2, $3, $4, true)
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
    // Si falla por una FK
    if (ex?.code === '23503') {
      const sqlDisable = 'UPDATE client_organization SET enabled = false WHERE id_client_organization = $1';
      await query(sqlDisable, id);
    } else throw ex;
  }
};

const getOrganizations = async ({ page }) => {
  const offset = page * consts.pageLength;
  const sql1 = 'SELECT COUNT(*) FROM client_organization';
  const { result: resultCount, rowCount: rowCount1 } = await query(sql1);
  if (rowCount1 === 0) throw new CustomError('No se encontraron resultados.', 404);
  const sql2 = `SELECT * FROM client_organization WHERE enabled = true ORDER BY id_client_organization LIMIT ${consts.pageLength} OFFSET ${offset}`;
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
  // eslint-disable-next-line import/prefer-default-export
  getClients,
  getOrderRequests,
  newOrganization,
  updateOrganization,
  deleteOrganization,
  getOrganizations,
  getOrganizationById,
};
