/*Función para obtener información del pedido aceptado*/
 CREATE OR REPLACE FUNCTION update_order_media()
 RETURNS trigger as
 $BODY$
 declare row record;
 begin
 	FOR row IN (
		select * from order_request_media where id_order_request = NEW.id_order_request
	  ) LOOP

		INSERT INTO order_media values(NEW.id_order, row.name);
  	END LOOP;
	RETURN NEW;
 END;
 $BODY$
 LANGUAGE 'plpgsql';

 DROP TRIGGER IF EXISTS tr_update_order_media ON "order"; 
 CREATE TRIGGER tr_update_order_media
 AFTER INSERT
 ON "order"
 FOR EACH ROW
 EXECUTE PROCEDURE update_order_media();