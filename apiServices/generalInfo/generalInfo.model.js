import query from '../../database/query.js';
import consts from '../../utils/consts.js';
import CustomError from '../../utils/customError.js';

const newSize = async ({ size }) => {
  const sql = 'INSERT INTO "size"("size") VALUES($1) RETURNING "size", "sequence" as id, "sequence";';

  try {
    const { result, rowCount } = await query(sql, size);

    if (rowCount !== 1) throw new CustomError('No se pudo registrar la talla', 500);

    return result[0];
  } catch (ex) {
    if (ex?.code === '23505') throw new CustomError('Esta talla ya existe.', 400);
    const error = 'Datos no válidos.';
    throw new CustomError(error, 400);
  }
};

const deleteSize = async ({ sizeId }) => {
  const sql = 'DELETE FROM "size" WHERE "size" = $1;';
  try {
    const { rowCount } = await query(sql, sizeId);

    if (rowCount !== 1) throw new CustomError('No se ha encontrado la talla especificada.', 404);
    return true;
  } catch (ex) {
    if (ex?.code === '23503') throw new CustomError('Esta talla ya se encuentra en uso.', 400);
    throw ex;
  }
};

const getSizes = async ({ search = '', page }) => {
  const offset = page * consts.pageLength;
  const sqlCount = 'select CEILING(COUNT(*)/$1::numeric) from size where "size" ilike $2';

  const params = [consts.pageLength, `%${search}%`];

  const pages = (await query(sqlCount, ...params)).result[0].ceiling;
  if (pages === 0) throw new CustomError('No se encontraron resultados.', 404);

  if (page !== undefined) params.push(consts.pageLength, offset);

  const sql = `select * from size where "size" ilike $1 order by "sequence" asc
  ${page !== undefined ? 'LIMIT $2 OFFSET $3' : ''}`;

  const { result, rowCount } = await query(sql, ...params.slice(1));

  if (rowCount === 0) throw new CustomError('No se encontraron resultados.', 404);

  const response = result.map((val) => ({
    id: val.id_size,
    size: val.size,
  }));

  return { result: response, count: pages };
};

const newMaterial = async ({ description }) => {
  const sql = 'INSERT INTO material(description) VALUES($1) RETURNING id_material as id;';

  try {
    const { result, rowCount } = await query(sql, description);

    if (rowCount !== 1) throw new CustomError('No se pudo registrar el material', 500);

    return result[0];
  } catch (ex) {
    const error = 'Datos no válidos.';
    throw new CustomError(error, 400);
  }
};

const getMaterials = async ({ search = '', page }) => {
  const offset = page * consts.pageLength;
  const sqlCount = `select CEILING(COUNT(*)/$1::numeric)
  from inventory i
  inner join material mat on i.material = mat.id_material
  where i.id_inventory ilike $2 or mat.name ilike $2
  or i.measurement_unit ilike $2 or i.details ilike $2 or mat.supplier ilike $2`;

  const params = [consts.pageLength, `%${search}%`];

  const pages = (await query(sqlCount, ...params)).result[0].ceiling;
  if (pages === 0) throw new CustomError('No se encontraron resultados.', 404);

  if (page !== undefined) params.push(consts.pageLength, offset);

  const sql = `select i.id_inventory, mat.id_material, mat.name, i.quantity,
  i.measurement_unit, i.details, mat.supplier
  from inventory i
  inner join material mat on i.material = mat.id_material
  where i.id_inventory ilike $1 or mat.name ilike $1
  or i.measurement_unit ilike $1 or i.details ilike $1
  or mat.supplier ilike $1
  ${page !== undefined ? 'LIMIT $2 OFFSET $3' : ''}`;

  const { result, rowCount } = await query(sql, ...params.slice(1));

  if (rowCount === 0) throw new CustomError('No se encontraron resultados.', 404);

  const response = result.map((val) => ({
    id: val.id_inventory,
    name: val.name,
    quantity: val.quantity,
    suuplier: val.supplier,
    measurementUnit: val.measurement_unit,
    details: val.details,
  }));

  return { result: response, count: pages };
};

const newFabric = async ({ fabric, color }) => {
  const sql = 'INSERT INTO fabric(fabric, color) VALUES($1,$2) RETURNING id_fabric as id;';

  try {
    const { result, rowCount } = await query(sql, fabric, color);

    if (rowCount !== 1) throw new CustomError('No se pudo registrar la tela', 500);

    return result[0];
  } catch (ex) {
    const error = 'Datos no válidos.';
    throw new CustomError(error, 400);
  }
};

export {
  getSizes,
  newSize,
  getMaterials,
  newMaterial,
  newFabric,
  deleteSize,
};
