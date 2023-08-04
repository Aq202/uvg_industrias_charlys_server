import query from '../../database/query.js';
import CustomError from '../../utils/customError.js';

const newColor = async ({
  name, red, green, blue,
}) => {
  const sql = 'insert into color values(default,$1,$2,$3,$4) RETURNING id_color as id;';

  try {
    const { result, rowCount } = await query(sql, name, red, green, blue);

    if (rowCount !== 1) throw new CustomError('No se pudo registrar el color', 500);

    return result[0];
  } catch (err) {
    if (err instanceof CustomError) throw err;

    if (err?.constraint === 'color_values_check') {
      throw new CustomError('El valor para cada color debe ser un número entre 0 y 255.', 400);
    }
    const error = 'Datos no válidos.';

    throw new CustomError(error, 400);
  }
};

const getColors = async ({ search }) => {
  let queryResult;
  if (search) {
    const sql = `select * from color
                where name ilike $1`;
    queryResult = await query(sql, `%${search}%`);
  } else {
    const sql = 'select * from color';
    queryResult = await query(sql);
  }

  const { result, rowCount } = queryResult;

  if (rowCount === 0) throw new CustomError('No se encontraron resultados.', 404);

  return result.map((val) => ({
    id: val.id_color,
    name: val.name,
    red: val.red,
    green: val.green,
    blue: val.blue,
  }));
};

export {
  getColors,
  newColor,
};
