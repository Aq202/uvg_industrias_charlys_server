import query from '../../database/query.js';
import consts from '../../utils/consts.js';
import CustomError from '../../utils/customError.js';

const newInventoryElement = async ({
  material,
  fabric,
  product,
  size,
  quantity,
  measurementUnit,
  supplier,
  details,
}) => {
  let sql;

  if (material) {
    sql = `INSERT INTO inventory(material, fabric, product, "size", quantity, measurement_unit, supplier, details)
          VALUES($1,$2,$3,$4,$5,$6,$7,$8)
          on conflict(material) do update set quantity = inventory.quantity + excluded.quantity
          returning id_inventory as id`;
  } else if (fabric) {
    sql = `INSERT INTO inventory(material, fabric, product, "size", quantity, measurement_unit, supplier, details)
          VALUES($1,$2,$3,$4,$5,$6,$7,$8)
          on conflict(fabric) do update set quantity = inventory.quantity + excluded.quantity
          returning id_inventory as id`;
  } else {
    sql = `INSERT INTO inventory(material, fabric, product, "size", quantity, measurement_unit, supplier, details)
          VALUES($1,$2,$3,$4,$5,$6,$7,$8)
          on conflict(product, "size") do update set quantity = inventory.quantity + excluded.quantity
          returning id_inventory as id`;
  }

  try {
    const { result, rowCount } = await query(
      sql,
      material,
      fabric,
      product,
      size,
      quantity,
      measurementUnit,
      supplier,
      details,
    );

    if (rowCount !== 1) throw new CustomError('No se pudo agregar el elemento al inventario', 500);

    return result[0];
  } catch (err) {
    console.log(err);
    if (err instanceof CustomError) throw err;

    if (err?.constraint === 'check_element') {
      throw new CustomError('Solo puede agregar un tipo de elemento a la vez.', 400);
    }
    const error = 'Datos no válidos.';

    throw new CustomError(error, 400);
  }
};

const getInventory = async (searchQuery) => {
  let queryResult;
  if (searchQuery) {
    const sql = `select id_inventory, COALESCE(mat.description, f.fabric,
                  CONCAT(pt.name, ' talla ', s.size, ' color ', prod.color, ' de ', co.name)) "element",
                  quantity, measurement_unit, supplier, details, f.color AS fabric_color,
                  mat.id_material, f.id_fabric, prod.id_product
                  from inventory i
                  left join material mat on i.material = mat.id_material
                  left join fabric f on i.fabric = f.id_fabric
                  left join product prod on i.product = prod.id_product
                  left join product_type pt on prod.type = pt.id_product_type
                  left join client_organization co on prod.client = co.id_client_organization
                  left join "size" s on i.size = s.id_size
                  where prod.id_product ilike $1 or prod.client ilike $1
                  or mat.id_material ilike $1 or f.id_fabric ilike $1
                  or measurement_unit ilike $1 or supplier ilike $1 or details ilike $1
                  or COALESCE(mat.description, f.fabric,
                    CONCAT(pt.name, ' talla ', s.size, ' color ', prod.color, ' de ', co.name)) ilike $1;`;
    queryResult = await query(sql, `%${searchQuery}%`);
  } else {
    const sql = `select id_inventory, COALESCE(mat.description, f.fabric,
                  CONCAT(pt.name, ' talla ', s.size, ' color ', prod.color, ' de ', co.name)) "element",
                  quantity, measurement_unit, supplier, details, f.color AS fabric_color,
                  mat.id_material, f.id_fabric, prod.id_product
                  from inventory i
                  left join material mat on i.material = mat.id_material
                  left join fabric f on i.fabric = f.id_fabric
                  left join product prod on i.product = prod.id_product
                  left join product_type pt on prod.type = pt.id_product_type
                  left join client_organization co on prod.client = co.id_client_organization
                  left join "size" s on i.size = s.id_size`;
    queryResult = await query(sql);
  }

  const { result, rowCount } = queryResult;

  if (rowCount === 0) throw new CustomError('No se encontraron resultados.', 404);

  return result.map((val) => ({
    id: val.id_inventory,
    element: val.element,
    quantity: val.quantity,
    measurementUnit: val.measurement_unit,
    supplier: val.supplier,
    details: val.details,
    fabricColor: val.fabric_color,
    itemId: val.id_material || val.id_fabric || val.id_product,
    // eslint-disable-next-line no-nested-ternary
    type: val.id_material
      ? consts.inventoryType.material
      : val.id_fabric
        ? consts.inventoryType.fabric
        : consts.inventoryType.product,
  }));
};

export { getInventory, newInventoryElement };
