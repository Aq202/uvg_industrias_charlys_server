import query from '../../database/query.js';
import consts from '../../utils/consts.js';
import CustomError from '../../utils/customError.js';
import exists, { someExists } from '../../utils/exists.js';

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
      } else {
        throw new CustomError('Se debe de espeficicar el tipo de elemento de inventario. ', 400);
      }
    }
    const error = 'Datos no válidos al agregar nuevo articulo de inventario.';

    throw new CustomError(error, 400);
  }
};

const updateMaterial = async ({
  inventoryId, name, supplier, color, typeId,
}) => {
  try {
    const sql = `UPDATE material SET name = $1, supplier = $2, color = $3, type=$4
                  WHERE id_material = (SELECT material FROM inventory WHERE id_inventory = $5)`;

    const { rowCount } = await query(sql, name, supplier, color, typeId, inventoryId);
    if (rowCount !== 1) throw new CustomError('No se encontró el material.', 400);
  } catch (ex) {
    if (ex instanceof CustomError) throw ex;
    throw ex;
  }
};

const updateInventoryElement = async ({
  inventoryId, quantity, measurementUnit, details,
}) => {
  if (!someExists(quantity, measurementUnit, details)) return;

  const params = [inventoryId];
  const queryOptions = [];
  if (exists(quantity)) {
    params.push(quantity);
    queryOptions.push(`quantity=$${params.length}`);
  }
  if (exists(measurementUnit)) {
    params.push(measurementUnit);
    queryOptions.push(`measurement_unit=$${params.length}`);
  }
  if (exists(details)) {
    params.push(details);
    queryOptions.push(`details=$${params.length}`);
  }

  const sql = `UPDATE inventory SET ${queryOptions.join(', ')}
                WHERE id_inventory =$1`;

  const { rowCount } = await query(sql, ...params);

  if (rowCount !== 1) {
    throw new CustomError('No se pudo actualizar el elemento al inventario', 500);
  }
};

const getInventory = async ({
  id, type, search = '', page,
}) => {
  const offset = page * consts.pageLength;
  const conditions = {
    count: [],
    query: [],
  };
  const params = [consts.pageLength, `%${search}%`];

  if (id !== undefined) {
    conditions.count.push(`I.id_inventory = $${params.length + 1}`);
    conditions.query.push(`I.id_inventory = $${params.length}`);
    params.push(id);
  }
  if (type !== undefined && type !== null) {
    conditions.count.push(`T.id_material_type = $${params.length + 1}`);
    conditions.query.push(`T.id_material_type = $${params.length}`);
    params.push(type);
  }

  const sqlCount = `SELECT ceiling(count(*)/$1::numeric)
  FROM inventory I
          INNER JOIN material M ON I.material = M.id_material
          INNER JOIN material_type T ON M.type = T.id_material_type
          WHERE (I.details ILIKE $2 OR M.name ILIKE $2
          OR M.supplier ILIKE $2 OR M.color ILIKE $2)
    ${conditions.count.length > 0 ? `AND ${conditions.count.join(' and ')}` : ''}`;

  const pages = (await query(sqlCount, ...params)).result[0].ceiling;
  if (pages === 0) throw new CustomError('No se encontraron resultados.', 404);

  if (page !== undefined) params.push(consts.pageLength, offset);

  const sql = `SELECT I.id_inventory, I.material, I.product, I.quantity, I.measurement_unit, I.details, M.name as material_name, 
  M.supplier, M.color, T.id_material_type, T.name AS material_type   
FROM inventory I
  INNER JOIN material M ON I.material = M.id_material
  INNER JOIN material_type T ON M.type = T.id_material_type
  WHERE (I.details ILIKE $1 OR M.name ILIKE $1
  OR M.supplier ILIKE $1 OR M.color ILIKE $1)
  ${conditions.query.length > 0 ? `AND ${conditions.query.join(' and ')}` : ''}
  ${page !== undefined ? `LIMIT $${params.length - 2} OFFSET $${params.length - 1}` : ''}`;

  const { result, rowCount } = await query(sql, ...params.slice(1));

  if (rowCount === 0) throw new CustomError('No se encontraron resultados.', 404);

  const response = result.map((val) => ({
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
  return { result: response, count: pages };
};

const newMaterialType = async (name) => {
  const sql = 'INSERT INTO material_type (name) VALUES ($1) RETURNING id_material_type AS id';
  const { result, rowCount } = await query(sql, name);

  if (rowCount !== 1) throw new CustomError('No se pudo insertar un nuevo tipo de material.', 500);
  return result[0].id;
};

const getMaterialsTypeList = async ({ search = '', page }) => {
  const offset = page * consts.pageLength;
  const sqlCount = 'SELECT ceiling(count(*)/ $1::numeric) from material_type where name ilike $2';

  const params = [consts.pageLength, `%${search}%`];

  const pages = (await query(sqlCount, ...params)).result[0].ceiling;
  if (pages === 0) throw new CustomError('No se encontraron tipos de material.', 404);

  if (page !== undefined) params.push(consts.pageLength, offset);

  const sql = `SELECT id_material_type AS id, name from material_type where name ilike $1
  ${page !== undefined ? 'LIMIT $2 OFFSET $3' : ''}`;

  const { result, rowCount } = await query(sql, ...params.slice(1));

  if (rowCount === 0) throw new CustomError('No se encontraron tipos de material.', 404);
  return { result, count: pages };
};

const addProductToInventory = async ({ idProduct, size, quantity }) => {
  try {
    const units = 'UNIDADES';

    const sqlQuery1 = 'INSERT INTO product_in_inventory(id_product, size) VALUES ($1,$2) RETURNING id';
    const { result: result1, rowCount: rowCount1 } = await query(sqlQuery1, idProduct, size);

    if (rowCount1 !== 1) {
      throw new CustomError('No se pudo insertar un producto al inventario.', 500);
    }

    const productInInventory = result1[0].id;
    const sqlQuery2 = 'INSERT INTO inventory(product, quantity, measurement_unit) VALUES ($1, $2, $3)';

    const { rowCount: rowCount2 } = await query(sqlQuery2, productInInventory, quantity, units);
    if (rowCount2 !== 1) {
      throw new CustomError('No se pudo insertar un producto al inventario.', 500);
    }
  } catch (ex) {
    if (ex?.code === '23505') {
      throw new CustomError(
        'La talla de ese producto ya fue almacenada en el inventario. Pruebe actualizar la cantidad de unidades.',
        400,
      );
    }
    if (ex?.code === '22001' || ex?.code === '23503') {
      throw new CustomError('No se encontró el producto.', 404);
    }
    throw ex;
  }
};

const getProductsInInventory = async ({ idOrganization, search, page = null }) => {
  const params = [];
  const conditions = ['1=1'];
  const { pageLength } = consts;

  if (exists(idOrganization)) {
    params.push(idOrganization);
    conditions.push(`p.id_client_organization = $${params.length}`);
  }

  if (exists(search)) {
    params.push(`%${search}%`);
    conditions.push(`(pt.name ILIKE $${params.length} OR p.name ILIKE $${params.length})`);
  }

  const sqlQuery = `
    SELECT DISTINCT inv.id_inventory, od.id_order, p.id_product, pi.size, inv.quantity, pt.name "type",
    p.name as product_name, co.name as client, pm.name as media, c.name as color_name, c.red, c.green, c.blue
    FROM inventory inv 
    INNER JOIN product_in_inventory pi ON pi.id = inv.product
    INNER JOIN product p ON p.id_product = pi.id_product
    INNER JOIN client_organization co ON p.id_client_organization = co.id_client_organization
    INNER JOIN order_detail od ON od.id_product = p.id_product
    INNER JOIN product_type pt on p.type = pt.id_product_type
    LEFT JOIN product_media pm ON pm.id_product = p.id_product
    LEFT JOIN product_color pc ON pc.id_product = p.id_product
    LEFT JOIN color c ON pc.id_color = c.id_color
    WHERE ${conditions.join(' AND ')}
    ORDER BY inv.id_inventory`;

  const pageQuery = `
  SELECT count(1) AS total
  FROM (  
  SELECT DISTINCT p.id_product
  FROM inventory inv 
  INNER JOIN product_in_inventory pi ON pi.id = inv.product
  INNER JOIN product p ON p.id_product = pi.id_product
  INNER JOIN client_organization co ON p.id_client_organization = co.id_client_organization
  INNER JOIN product_type pt on p.type = pt.id_product_type
  WHERE ${conditions.join(' AND ')}
  ) AS Q2`;

  const { result: totalRowCount } = await query(pageQuery, ...params);
  const pagesNumber = Math.ceil(totalRowCount[0].total / pageLength);

  const { result, rowCount } = await query(sqlQuery, ...params);

  if (rowCount < 1) throw new CustomError('No se encontraron productos en inventario', 404);

  const groupedResult = {};

  result.forEach(
    ({
      id_order: idOrder,
      id_product: idProduct,
      product_name: productName,
      type,
      size,
      quantity,
      client,
      media,
      color_name: colorName,
      red,
      green,
      blue,
    }) => {
      // Si no existe, agregar datos completos. De lo contrario agregar solo colores y media
      if (!(idProduct in groupedResult)) {
        groupedResult[idProduct] = {
          idOrder,
          idProduct,
          productName,
          type,
          client,
          sizesAdded: [size],
          sizes: [{ size, quantity }],
          media: exists(media) ? [media] : [],
          colorsAdded: exists(colorName) ? [colorName] : [],
          colors: exists(colorName)
            ? [
              {
                name: colorName,
                r: red,
                g: green,
                b: blue,
              },
            ]
            : [],
        };
      } else {
        const product = groupedResult[idProduct];

        if (!product.sizesAdded.includes(size)) {
          product.sizesAdded.push(size);
          product.sizes.push({ size, quantity });
        }

        if (exists(media) && !product.media.includes(media)) product.media.push(media);

        if (!product.colorsAdded.includes(colorName) && exists(colorName)) {
          product.colors.push({
            name: colorName,
            r: red,
            g: green,
            b: blue,
          });
        }
      }
    },
  );

  let finalResult = Object.values(groupedResult).map((product) => {
    const cp = product;
    delete cp.sizesAdded;
    delete cp.colorsAdded;
    return cp;
  });

  if (exists(page)) {
    finalResult = finalResult.slice(page * pageLength, page * pageLength + pageLength);
  }

  return { pages: pagesNumber, result: finalResult };
};

const getProductInventoryId = async ({ productId, size }) => {
  const sqlQuery = `SELECT I.id_inventory AS id FROM inventory I 
                    INNER JOIN product_in_inventory P ON P.id = I.product
                    WHERE P.id_product = $1 AND P.size = $2 `;

  const { result, rowCount } = await query(sqlQuery, productId, size);

  if (rowCount === 0) throw new CustomError('No se encontró el item en inventario.', 404);

  return result[0].id;
};

export {
  getInventory,
  newInventoryElement,
  updateInventoryElement,
  newMaterialType,
  getMaterialsTypeList,
  newMaterial,
  updateMaterial,
  addProductToInventory,
  getProductsInInventory,
  getProductInventoryId,
};
