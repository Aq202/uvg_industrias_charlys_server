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