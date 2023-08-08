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

const getProductsbyOrganization = async ({ idClient, colors = null, types = null }) => {
  try {
    let sql = 'SELECT id_product, pt.name as type, c.name as color FROM product p INNER JOIN product_type pt ON p.type = pt.id_product_type INNER JOIN color c ON p.color = c.id_color WHERE p.client = $1';
    if (colors instanceof Array && colors.length > 0) {
      sql += ' AND (';
      colors.forEach((color, index) => {
        sql += `c.name ILIKE '${color}'`;
        if (index < colors.length - 1) {
          sql += ' OR ';
        }
      });
      sql += ')';
    }
    if (types instanceof Array && types.length > 0) {
      sql += ' AND (';
      types.forEach((type, index) => {
        sql += `pt.name ILIKE '${type}'`;
        if (index < types.length - 1) {
          sql += ' OR ';
        }
      });
      sql += ')';
    }
    sql += ';';
    const { result, rowCount } = await query(sql, idClient);
    if (rowCount === 0) throw new CustomError('No se encontraron productos.', 404);
    return result;
  } catch (ex) {
    if (ex instanceof CustomError) throw ex;
    throw ex;
  }
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

const newProductModel = async ({
  type, idClientOrganization, name, details,
}) => {
  try {
    const sql = 'INSERT INTO product_model("type", id_client_organization, "name", details) VALUES($1, $2, $3, $4) RETURNING id_product_model as id;';

    const { result, rowCount } = await query(sql, type, idClientOrganization, name, details);

    if (rowCount !== 1) throw new CustomError('No se pudo registrar el modelo del producto.', 500);

    return result[0].id;
  } catch (ex) {
    if (ex?.code === '23503') {
      if (ex?.detail.includes('type')) throw new CustomError('El tipo de producto no existe.', 400);
      if (ex?.detail.includes('id_client_organization')) throw new CustomError('La organización del cliente no existe.', 400);
    }
    throw ex;
  }
};

const addProductModelColor = async ({ idProductModel, idColor }) => {
  try {
    const sql = 'INSERT INTO product_model_color(id_product_model, id_color) VALUES($1, $2);';

    const { rowCount } = await query(sql, idProductModel, idColor);

    if (rowCount !== 1) throw new CustomError('No se pudo agregar el color al modelo del producto.', 500);
  } catch (ex) {
    if (ex?.code === '23503') {
      if (ex?.detail.includes('id_product_model')) throw new CustomError('El modelo de producto proporcionado no existe.', 400);
      if (ex?.detail.includes('id_color')) throw new CustomError('El color proporcionado no existe.', 400);
    }
    throw ex;
  }
};

const addProductModelMedia = async ({ idProductModel, name }) => {
  try {
    const sql = 'INSERT INTO product_model_media(id_product_model, name) VALUES($1, $2);';

    const { rowCount } = await query(sql, idProductModel, name);

    if (rowCount !== 1) throw new CustomError('No se pudo guardar el recurso multimedia para el modelo de producto.', 500);
  } catch (ex) {
    if (ex?.code === '23503') throw new CustomError('El modelo de producto proporcionado no existe.', 400);
    throw ex;
  }
};

export {
  getProductTypes,
  newProductType,
  getProducts,
  getProductsbyOrganization,
  newProduct,
  getRequirements,
  newRequeriment,
  newProductModel,
  addProductModelColor,
  addProductModelMedia,
};
