 
 /*Función para asignar el nuevo id al usuario*/
 CREATE OR REPLACE FUNCTION assign_user_id()
 RETURNS trigger as
 $BODY$
 declare prev_id_number integer;
 begin
 	SELECT CAST(SUBSTRING(id_user FROM 2) AS INTEGER) INTO prev_id_number FROM user_account ORDER BY id_user DESC LIMIT 1;
	IF (prev_id_number IS NULL) THEN
		prev_id_number = 0;
		END IF;
	NEW.id_user = CONCAT('U', LPAD(CAST(prev_id_number + 1 AS VARCHAR), 14, '0'));
	RETURN NEW;
 END;
 $BODY$
 LANGUAGE 'plpgsql';

 DROP TRIGGER IF EXISTS tr_assign_user_id ON user_account; 
 CREATE TRIGGER tr_assign_user_id
 BEFORE INSERT
 ON user_account
 FOR EACH ROW
 EXECUTE PROCEDURE assign_user_id();
 
 
 /*Función para asignar el nuevo id a la tabla empledo*/
 CREATE OR REPLACE FUNCTION assign_employee_id()
 RETURNS trigger as
 $BODY$
 declare prev_id_number integer;
 begin
 	SELECT CAST(SUBSTRING(id_employee FROM 2) AS INTEGER) INTO prev_id_number FROM employee ORDER BY id_employee DESC LIMIT 1;
	IF (prev_id_number IS NULL) THEN
		prev_id_number = 0;
		END IF;
	NEW.id_employee = CONCAT('E', LPAD(CAST(prev_id_number + 1 AS VARCHAR), 14, '0'));
	RETURN NEW;
 END;
 $BODY$
 LANGUAGE 'plpgsql';

 DROP TRIGGER IF EXISTS tr_assign_employee_id ON employee; 
 CREATE TRIGGER tr_assign_employee_id
 BEFORE INSERT
 ON employee
 FOR EACH ROW
 EXECUTE PROCEDURE assign_employee_id();