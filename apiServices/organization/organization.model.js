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

const getOrderRequests = async ({ idClient, page, search = '' }) => {
  const offset = page * consts.pageLength;
  const sqlCount = `select ceiling(count(*) / $1:: numeric) from order_request
    where(id_client_organization = $2 or id_temporary_client = $2)
    and(description ilike $3 or aditional_details ilike $3); `;
  const pages = (await query(sqlCount, consts.pageLength, idClient, `%${search}%`)).result[0].ceiling;

  const sql = `select * from order_request
      where (id_client_organization = $1 or id_temporary_client = $1)
      and (description ilike $2 or aditional_details ilike $2)
      ${page !== undefined ? 'LIMIT $3 OFFSET $4' : ''}`;

  const { result, rowCount } = page === undefined
    ? await query(sql, idClient, `%${search}%`)
    : await query(sql, idClient, `%${search}%`, consts.pageLength, offset);

  if (rowCount === 0) throw new CustomError('No se encontraron resultados.', 404);

  const response = result.map((val) => ({
    id: val.id_order_request,
    description: val.description,
    date_placed: val.date_placed,
    client: val.id_client_organization || val.id_temporary_client,
    deadline: val.deadline,
    cost: val.cost,
    details: val.aditional_details,
  }));
  return { result: response, count: pages };
};

const isMember = async ({ userId, idClient }) => {
  const sql = `select $1 in (
      select id_user from user_account where id_client_organization = $2
    ) exists`;

  const { result } = await query(sql, userId, idClient);
  return result[0].exists;
};

const getOrders = async ({ idClient, page, search = '' }) => {
  const offset = page * consts.pageLength;
  const sqlCount = `select ceiling(count(*) / $1:: numeric) from "order"
    where(id_client_organization = $2)
    and(description ilike $3); `;
  const pages = (await query(sqlCount, consts.pageLength, idClient, `%${search}%`)).result[0].ceiling;

  const sql = `select * from "order"
    where(id_client_organization = $1)
    and(description ilike $2) ${page !== undefined ? 'LIMIT $3 OFFSET $4;' : ''}`;

  const { result, rowCount } = page === undefined
    ? await query(sql, idClient, `%${search}%`)
    : await query(sql, idClient, `%${search}%`, consts.pageLength, offset);

  if (rowCount === 0) throw new CustomError('No se encontraron resultados.', 404);

  const response = result.map((val) => ({
    id: val.id_order_request,
    description: val.description,
    client: val.id_client_organization,
    deadline: val.deadline,
    cost: val.cost,
  }));
  return { result: response, count: pages };
};

const getClients = async ({ idOrganization, page, search = '' }) => {
  const offset = page * consts.pageLength;
  const sqlCount = `select ceiling(count(*) / $1::numeric) from user_account
    where id_client_organization = $2 and enabled = true
    and("name" ilike $3 or lastname ilike $3 or email ilike $3
    or phone ilike $3); `;

  const pages = (await query(sqlCount, consts.pageLength, idOrganization, `%${search}%`)).result[0].ceiling;
  const sql = `select * from user_account where id_client_organization = $1 AND enabled = true
    and("name" ilike $2 or lastname ilike $2 or email ilike $2
    or phone ilike $2) ${page !== undefined ? 'LIMIT $3 OFFSET $4;' : ''}`;

  const { result, rowCount } = page === undefined
    ? await query(sql, idOrganization, `%${search}%`)
    : await query(sql, idOrganization, `%${search}%`, consts.pageLength, offset);

  if (rowCount === 0) throw new CustomError('No se encontraron resultados.', 404);

  const response = result.map((val) => ({
    id: val.id_user,
    name: val.name,
    lastname: val.lastname,
    email: val.email,
    phone: val.phone,
    sex: val.sex,
  }));
  return { result: response, count: pages };
};

const newOrganization = async ({
  name, email, phone, address,
}) => {
  try {
    const sql = `INSERT INTO client_organization(name, email, phone, address, enabled) VALUES($1, $2, $3, $4, true)
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

const getOrganizations = async ({ page, search = '' }) => {
  const offset = page * consts.pageLength;
  const sqlCount = `SELECT ceiling(count(*)/$1::numeric) FROM client_organization
    WHERE enabled = true and (
    name ilike $2 or email ilike $2 or phone ilike $2 or
    address ilike $2)`;
  const pages = (await query(sqlCount, consts.pageLength, `%${search}%`)).result[0].ceiling;

  const sql = `SELECT * FROM client_organization WHERE enabled = true and (
    name ilike $1 or email ilike $1 or phone ilike $1 or address ilike $1) ORDER BY id_client_organization
    ${page !== undefined ? 'LIMIT $2 OFFSET $3' : ''} `;

  const { result, rowCount } = page === undefined
    ? await query(sql, `%${search}%`)
    : await query(sql, `%${search}%`, consts.pageLength, offset);

  if (rowCount === 0) throw new CustomError('No se encontraron resultados.', 404);

  const response = result.map((val) => ({
    id: val.id_client_organization,
    name: val.name,
    email: val.email,
    phone: val.phone,
    address: val.address,
    enabled: val.enabled,
  }));
  return { result: response, count: pages };
};

const verifyUser = async ({ userId, idClient }) => {
  try {
    const sql = 'SELECT id_client_organization FROM user_account WHERE id_user = $1';
    const { result, rowCount } = await query(sql, userId);
    if (rowCount === 0) throw new CustomError('No se encontró el usuario.', 404);
    return result[0].id_client_organization === idClient;
  } catch (ex) {
    if (ex instanceof CustomError) throw ex;
    throw ex;
  }
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
  getOrders,
  isMember,
  verifyUser,
};
