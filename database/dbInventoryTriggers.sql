/*Función para asignar el nuevo id a la talla*/
 CREATE OR REPLACE FUNCTION assign_size_id()
 RETURNS trigger as
 $BODY$
 declare prev_id_number integer;
 begin
 	SELECT CAST(SUBSTRING(id_size FROM 2) AS INTEGER) INTO prev_id_number FROM size ORDER BY id_size DESC LIMIT 1;
	IF (prev_id_number IS NULL) THEN
		prev_id_number = 0;
		END IF;
	NEW.id_size = CONCAT('S', LPAD(CAST(prev_id_number + 1 AS VARCHAR), 14, '0'));
	RETURN NEW;
 END;
 $BODY$
 LANGUAGE 'plpgsql';

 DROP TRIGGER IF EXISTS tr_assign_size_id ON "size"; 
 CREATE TRIGGER tr_assign_size_id
 BEFORE INSERT
 ON "size"
 FOR EACH ROW
 EXECUTE PROCEDURE assign_size_id();
 
 /*Función para asignar el nuevo id al producto*/
 CREATE OR REPLACE FUNCTION assign_product_id()
 RETURNS trigger as
 $BODY$
 declare prev_id_number integer;
 begin
 	SELECT CAST(SUBSTRING(id_product FROM 2) AS INTEGER) INTO prev_id_number FROM product ORDER BY id_product DESC LIMIT 1;
	IF (prev_id_number IS NULL) THEN
		prev_id_number = 0;
		END IF;
	NEW.id_product = CONCAT('P', LPAD(CAST(prev_id_number + 1 AS VARCHAR), 14, '0'));
	RETURN NEW;
 END;
 $BODY$
 LANGUAGE 'plpgsql';

 DROP TRIGGER IF EXISTS tr_assign_product_id ON product; 
 CREATE TRIGGER tr_assign_product_id
 BEFORE INSERT
 ON product
 FOR EACH ROW
 EXECUTE PROCEDURE assign_product_id();
 
 /*Función para asignar el nuevo id al material*/
 CREATE OR REPLACE FUNCTION assign_material_id()
 RETURNS trigger as
 $BODY$
 declare prev_id_number integer;
 begin
 	SELECT CAST(SUBSTRING(id_material FROM 4) AS INTEGER) INTO prev_id_number FROM material ORDER BY id_material DESC LIMIT 1;
	IF (prev_id_number IS NULL) THEN
		prev_id_number = 0;
		END IF;
	NEW.id_material = CONCAT('MAT', LPAD(CAST(prev_id_number + 1 AS VARCHAR), 12, '0'));
	RETURN NEW;
 END;
 $BODY$
 LANGUAGE 'plpgsql';

 DROP TRIGGER IF EXISTS tr_assign_material_id ON material; 
 CREATE TRIGGER tr_assign_material_id
 BEFORE INSERT
 ON material
 FOR EACH ROW
 EXECUTE PROCEDURE assign_material_id();
 
 /*Función para asignar el nuevo id a la tela*/
 CREATE OR REPLACE FUNCTION assign_fabric_id()
 RETURNS trigger as
 $BODY$
 declare prev_id_number integer;
 begin
 	SELECT CAST(SUBSTRING(id_fabric FROM 2) AS INTEGER) INTO prev_id_number FROM fabric ORDER BY id_fabric DESC LIMIT 1;
	IF (prev_id_number IS NULL) THEN
		prev_id_number = 0;
		END IF;
	NEW.id_fabric = CONCAT('F', LPAD(CAST(prev_id_number + 1 AS VARCHAR), 14, '0'));
	RETURN NEW;
 END;
 $BODY$
 LANGUAGE 'plpgsql';

 DROP TRIGGER IF EXISTS tr_assign_fabric_id ON fabric; 
 CREATE TRIGGER tr_assign_fabric_id
 BEFORE INSERT
 ON fabric
 FOR EACH ROW
 EXECUTE PROCEDURE assign_fabric_id();
 
 /*Función para asignar el nuevo id al elemento en bodega*/
 CREATE OR REPLACE FUNCTION assign_inventory_id()
 RETURNS trigger as
 $BODY$
 declare prev_id_number integer;
 begin
 	SELECT CAST(SUBSTRING(id_inventory FROM 4) AS INTEGER) INTO prev_id_number FROM inventory ORDER BY id_inventory DESC LIMIT 1;
	IF (prev_id_number IS NULL) THEN
		prev_id_number = 0;
		END IF;
	NEW.id_inventory = CONCAT('INV', LPAD(CAST(prev_id_number + 1 AS VARCHAR), 12, '0'));
	RETURN NEW;
 END;
 $BODY$
 LANGUAGE 'plpgsql';

 DROP TRIGGER IF EXISTS tr_assign_inventory_id ON inventory; 
 CREATE TRIGGER tr_assign_inventory_id
 BEFORE INSERT
 ON inventory
 FOR EACH ROW
 EXECUTE PROCEDURE assign_inventory_id();
 
 /* Verificar existencias de los materiales necesitados para un producto */
 CREATE OR REPLACE FUNCTION check_availability()
 RETURNS trigger as
 $BODY$
 declare row record;
 begin
 	FOR row IN (
  	SELECT * FROM get_not_enough(new.product,new.size, new.quantity)
  ) LOOP
  
  	if row.tipo = 'material' then
    	RAISE WARNING 'Advertencia: No hay suficiente cantidad del siguiente material: %.
	 	Se necesitan % y en bodega hay %', row.element, row.required, row.available;
	else
		RAISE WARNING 'Advertencia: No hay suficiente cantidad de la siguiente tela: %.
		Se necesitan % yardas y en bodega hay %', row.element, row.required, row.available;
	end if;
  END LOOP;
	RETURN NEW;
 END;
 $BODY$
 LANGUAGE 'plpgsql';
 
DROP TRIGGER IF EXISTS tr_check_availability ON order_detail; 
 CREATE TRIGGER tr_check_availability
 BEFORE INSERT
 ON order_detail
 FOR EACH ROW
 EXECUTE PROCEDURE check_availability();