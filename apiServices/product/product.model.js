import query from '../../database/query.js';
import CustomError from '../../utils/customError.js';

const newProductType = async ({ name }) => {
  const sql = 'INSERT INTO product_type("name") VALUES($1) RETURNING id_product_type as id;';

  try {
    const { result, rowCount } = await query(sql, name);

    if (rowCount !== 1) throw new CustomError('No se pudo registrar el tipo de producto', 500);

    return result[0];
  } catch (ex) {
    const error = 'Datos no válidos.';
    throw new CustomError(error, 400);
  }
};

const getProductTypes = async () => {
  const queryResult = await query('select * from product_type');

  const { result, rowCount } = queryResult;

  if (rowCount === 0) throw new CustomError('No se encontraron resultados.', 404);

  return result.map((val) => ({
    id: val.id_product_type,
    name: val.name,
  }));
};

const newProduct = async ({ type, client, color }) => {
  const sql = 'INSERT INTO product("type", client, color) VALUES($1, $2, $3) RETURNING id_product as id;';

  try {
    const { result, rowCount } = await query(sql, type, client, color);

    if (rowCount !== 1) throw new CustomError('No se pudo registrar el producto', 500);

    return result[0];
  } catch (ex) {
    const error = 'Datos no válidos.';
    throw new CustomError(error, 400);
  }
};

const getProducts = async (searchQuery) => {
  let queryResult;
  if (searchQuery) {
    const sql = `select prod.id_product, pt.name product, prod.client client_id, co.name client, prod.color from product prod
                inner join product_type pt on prod.type = pt.id_product_type
                inner join client_organization co on prod.client = co.id_client_organization
                where prod.client ilike $1
                or prod.id_product ilike $1
                or pt.name ilike $1
                or prod.color ilike $1`;
    queryResult = await query(sql, `%${searchQuery}%`);
  } else {
    const sql = `select prod.id_product, pt.name product, prod.client client_id, co.name client, prod.color from product prod
                inner join product_type pt on prod.type = pt.id_product_type
                inner join client_organization co on prod.client = co.id_client_organization`;
    queryResult = await query(sql);
  }

  const { result, rowCount } = queryResult;

  if (rowCount === 0) throw new CustomError('No se encontraron resultados.', 404);

  return result.map((val) => ({
    id: val.id_product,
    product: val.product,
    client_id: val.client_id,
    client: val.client,
    color: val.color,
  }));
};

const newRequeriment = async ({
  product, size, material, fabric, quantityPerUnit,
}) => {
  const sql = `INSERT INTO requirements VALUES($1,$2,$3,$4,$5)
    RETURNING product as id;`;

  try {
    const { result, rowCount } = await query(
      sql,
      product,
      size,
      material,
      fabric,
      quantityPerUnit,
    );

    if (rowCount !== 1) throw new CustomError('No se pudo registrar requerimiento para el producto', 500);

    return result[0];
  } catch (err) {
    if (err instanceof CustomError) throw err;

    if (err?.constraint === 'check_requirement') {
      throw new CustomError('Solo puede agregar un tipo de material a la vez.', 400);
    }
    const error = 'Datos no válidos.';

    throw new CustomError(error, 400);
  }
};

const getRequirements = async (product, searchQuery) => {
  let queryResult;
  if (searchQuery) {
    const sql = `select r.product id_product, s.size, COALESCE(mat.description, f.fabric) material,
                r.quantity_per_unit from requirements r
                inner join product prod on r.product = prod.id_product
                inner join product_type pt on prod.type = pt.id_product_type
                inner join client_organization co on prod.client = co.id_client_organization
                inner join "size" s on r.size = s.id_size
                left join material mat on r.material = mat.id_material
                left join fabric f on r.fabric = f.id_fabric
                where r.product = $1
                AND (s.size ilike $2 or mat.description ilike $2 or f.fabric ilike $2);`;
    queryResult = await query(sql, product, `%${searchQuery}%`);
  } else {
    const sql = `select r.product id_product, s.size, COALESCE(mat.description, f.fabric) material,
                r.quantity_per_unit from requirements r
                inner join product prod on r.product = prod.id_product
                inner join product_type pt on prod.type = pt.id_product_type
                inner join client_organization co on prod.client = co.id_client_organization
                inner join "size" s on r.size = s.id_size
                left join material mat on r.material = mat.id_material
                left join fabric f on r.fabric = f.id_fabric
                where r.product = $1`;
    queryResult = await query(sql, product);
  }

  const { result, rowCount } = queryResult;

  if (rowCount === 0) throw new CustomError('No se encontraron resultados.', 404);

  return result.map((val) => ({
    id: val.id_product,
    size: val.size,
    material: val.material,
    quantity: val.quantity_per_unit,
  }));
};

export {
  getProductTypes,
  newProductType,
  getProducts,
  newProduct,
  getRequirements,
  newRequeriment,
};
