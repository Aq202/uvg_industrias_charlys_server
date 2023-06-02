import query from '../../database/query.js';
import consts from '../../utils/consts.js';
import CustomError from '../../utils/customError.js';

const newMaterial = async ({
  name, supplier, color, typeId,
}) => {
  try {
    const sql = `INSERT INTO material(name, supplier, color, type) VALUES ($1, $2, $3, $4)
                RETURNING id_material AS id`;

    const { result, rowCount } = await query(sql, name, supplier, color, typeId);
    if (rowCount !== 1) throw new CustomError('Ocurrió un error al insertar el material.', 500);

    return result[0].id;
  } catch (ex) {
    if (ex instanceof CustomError) throw ex;
    throw ex;
  }
};

const newInventoryElement = async ({
  materialId,
  productId,
  quantity,
  measurementUnit,
  details,
}) => {
  const sql = `INSERT INTO inventory(material, product,  quantity, measurement_unit, details)
              VALUES($1,$2,$3,$4,$5)
              on conflict(material) do update set quantity = inventory.quantity + excluded.quantity
              returning id_inventory as id`;

  try {
    const { result, rowCount } = await query(
      sql,
      materialId ?? null,
      productId ?? null,
      quantity,
      measurementUnit,
      details,
    );

    if (rowCount !== 1) throw new CustomError('No se pudo agregar el elemento al inventario', 500);

    return result[0].id;
  } catch (err) {
    if (err instanceof CustomError) throw err;

    if (err?.constraint === 'check_element') {
      if (materialId || productId) {
        throw new CustomError('Solo puede agregar un tipo de elemento a la vez.', 400);
      } else { throw new CustomError('Se debe de espeficicar el tipo de elemento de inventario. ', 400); }
    }
    const error = 'Datos no válidos al agregar nuevo articulo de inventario.';

    throw new CustomError(error, 400);
  }
};

const getInventory = async ({ id, type, search }) => {
  let sql = `SELECT I.id_inventory, I.material, I.product, I.quantity, I.measurement_unit, I.details, M.name as material_name, 
                M.supplier, M.color, T.id_material_type, T.name AS material_type   FROM inventory I
                INNER JOIN material M ON I.material = M.id_material
                INNER JOIN material_type T ON M.type = T.id_material_type
                WHERE 1=1`;
  const params = [];
  if (id) {
    params.push(id);
    sql += ` AND I.id_inventory = $${params.length}`;
  }

  if (type !== undefined && type !== null) {
    params.push(type);
    sql += ` AND T.id_material_type = $${params.length}`;
  }

  if (search) {
    params.push(`%${search}%`);
    const paramsIndex = params.length;
    sql += ` AND (I.details ILIKE $${paramsIndex} OR M.name ILIKE $${paramsIndex} 
                OR M.supplier ILIKE $${paramsIndex} OR M.color ILIKE $${paramsIndex} )`;
  }

  const { result, rowCount } = params.length > 0 ? await query(sql, ...params) : await query(sql);

  if (rowCount === 0) throw new CustomError('No se encontraron resultados.', 404);

  return result.map((val) => ({
    id: val.id_inventory,
    quantity: val.quantity,
    measurementUnit: val.measurement_unit,
    supplier: val.supplier,
    details: val.details,
    color: val.color,
    type: val.material ? consts.inventoryType.material : consts.inventoryType.product,
    idMaterialType: val.id_material_type,
    materialType: val.material_type,
    materialName: val.material_name,
  }));
};

const getInventorybyId = async (searchQuery) => {
  const sql = `select id_inventory,
  coalesce(prod.id_product, f.id_fabric, mat.id_material) as category_id,
  COALESCE(mat.description, f.fabric, pt.name) as description,
  coalesce(f.color, prod.color) as color,
  s.size,
  co.name as client,
  quantity, measurement_unit, supplier, details
      from inventory i
      left join material mat on i.material = mat.id_material
      left join fabric f on i.fabric = f.id_fabric
      left join product prod on i.product = prod.id_product
      left join product_type pt on prod.type = pt.id_product_type
      left join client_organization co on prod.client = co.id_client_organization
      left join "size" s on i.size = s.id_size
      where i.id_inventory = $1;`;
  const queryResult = await query(sql, searchQuery);

  const { result, rowCount } = queryResult;

  if (rowCount === 0) throw new CustomError('No se encontraron resultados.', 404);
  return result;
};

const updateInventoryElement = async ({
  material,
  fabric,
  product,
  description,
  color,
  quantity,
  supplier,
  details,
}) => {
  let sql1;
  let sql2;

  if (material != null) {
    sql1 = `update material
      set description = $2
    where id_material = $1
    returning id_material as id;`;

    sql2 = `update inventory
     set quantity = $2, supplier = $3, details = $4
    where material = $1
    returning id_inventory as id;`;

    try {
      const { rowCount } = await query(sql1, material, description);

      if (rowCount !== 1) throw new CustomError('No se pudo actualizar el elemento', 500);
    } catch (err) {
      console.log(err);
      if (err instanceof CustomError) throw err;
      const error = 'Datos no válidos.';

      throw new CustomError(error, 400);
    }

    try {
      const { result, rowCount } = await query(sql2, material, quantity, supplier, details);
      if (rowCount !== 1) throw new CustomError('No se pudo actualizar el elemento', 500);
      return result[0];
    } catch (err) {
      console.log(err);
      if (err instanceof CustomError) throw err;
      const error = 'Datos no válidos.';

      throw new CustomError(error, 400);
    }
  } else if (fabric != null) {
    sql1 = `update fabric
      set fabric = $2, color = $3
    where id_fabric = $1
    returning id_fabric as id;`;

    sql2 = `update inventory
      set quantity = $2, supplier = $3, details = $4
    where fabric = $1
    returning id_inventory as id;`;

    try {
      const { rowCount } = await query(sql1, fabric, description, color);

      if (rowCount !== 1) throw new CustomError('No se pudo actualizar el elemento', 500);
    } catch (err) {
      console.log(err);
      if (err instanceof CustomError) throw err;
      const error = 'Datos no válidos.';

      throw new CustomError(error, 400);
    }

    try {
      const { result, rowCount } = await query(sql2, fabric, quantity, supplier, details);
      if (rowCount !== 1) throw new CustomError('No se pudo actualizar el elemento', 500);
      return result[0];
    } catch (err) {
      console.log(err);
      if (err instanceof CustomError) throw err;
      const error = 'Datos no válidos.';

      throw new CustomError(error, 400);
    }
  } else {
    sql1 = `update product
    set color = $2
    where id_product = $1
    returning id_product as id;`;

    sql2 = `update inventory
    set quantity = $2, supplier = $3, details = $4
    where product = $1
    returning id_inventory as id;`;

    try {
      const { rowCount } = await query(sql1, product, color);

      if (rowCount !== 1) throw new CustomError('No se pudo actualizar el elemento', 500);
    } catch (err) {
      console.log(err);
      if (err instanceof CustomError) throw err;
      const error = 'Datos no válidos.';

      throw new CustomError(error, 400);
    }

    try {
      const { result, rowCount } = await query(sql2, product, quantity, supplier, details);
      if (rowCount !== 1) throw new CustomError('No se pudo actualizar el elemento', 500);
      return result[0];
    } catch (err) {
      console.log(err);
      if (err instanceof CustomError) throw err;
      const error = 'Datos no válidos.';

      throw new CustomError(error, 400);
    }
  }
};

const newMaterialType = async (name) => {
  const sql = 'INSERT INTO material_type (name) VALUES ($1) RETURNING id_material_type AS id';
  const { result, rowCount } = await query(sql, name);

  if (rowCount !== 1) throw new CustomError('No se pudo insertar un nuevo tipo de material.', 500);
  return result[0].id;
};

const getMaterialsTypeList = async () => {
  const sql = 'SELECT id_material_type AS id, name from material_type';
  const { result, rowCount } = await query(sql);

  if (rowCount < 1) throw new CustomError('No se encontraron tipos de material.', 404);
  return result;
};

export {
  getInventory,
  newInventoryElement,
  getInventorybyId,
  updateInventoryElement,
  newMaterialType,
  getMaterialsTypeList,
  newMaterial,
};
