import query from '../../database/query.js';
import CustomError from '../../utils/customError.js';

const newSize = async ({ size }) => {
  const sql = 'INSERT INTO "size"("size") VALUES($1) RETURNING id_size as id;';

  try {
    const { result, rowCount } = await query(sql, size);

    if (rowCount !== 1) throw new CustomError('No se pudo registrar la talla', 500);

    return result[0];
  } catch (ex) {
    const error = 'Datos no válidos.';
    throw new CustomError(error, 400);
  }
};

const getSizes = async () => {
  const queryResult = await query('select * from size');

  const { result, rowCount } = queryResult;

  if (rowCount === 0) throw new CustomError('No se encontraron resultados.', 404);

  return result.map((val) => ({
    id: val.id_size,
    size: val.size,
  }));
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

const getMaterials = async () => {
  const queryResult = await query('select * from material');

  const { result, rowCount } = queryResult;

  if (rowCount === 0) throw new CustomError('No se encontraron resultados.', 404);

  return result.map((val) => ({
    id: val.id_material,
    description: val.description,
  }));
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

const getFabrics = async () => {
  const queryResult = await query('select * from fabric');

  const { result, rowCount } = queryResult;

  if (rowCount === 0) throw new CustomError('No se encontraron resultados.', 404);

  return result.map((val) => ({
    id: val.id_fabric,
    fabric: val.fabric,
    color: val.color,
  }));
};

export {
  getSizes,
  newSize,
  getMaterials,
  newMaterial,
  getFabrics,
  newFabric,
};
