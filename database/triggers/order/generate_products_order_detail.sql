/*Función para crear productos y order_detail a partir de order_request*/
 CREATE OR REPLACE FUNCTION generate_products_order_detail()
 RETURNS trigger as
 $BODY$
 declare row record;
 begin
 	FOR row IN (
		select distinct id_product_model, "type", id_client_organization, "name", details
			from order_request_requirement natural join product_model 
			where id_order_request = NEW.id_order_request
	  ) LOOP
		INSERT INTO product(id_product, id_product_model, "type", id_client_organization, "name", details)
			values(default, row.id_product_model, row."type", row.id_client_organization, row."name", row.details);
  	END LOOP;
	
	FOR row IN (
		select id_order_request, p.id_product_model, "size", quantity, id_product
			from order_request_requirement natural join product p
			where id_order_request = NEW.id_order_request
	  ) LOOP
		INSERT INTO order_detail values(NEW.id_order, row.id_product, row."size", row.quantity);
  	END LOOP;
	RETURN NEW;
 END;
 $BODY$
 LANGUAGE 'plpgsql';

 DROP TRIGGER IF EXISTS tr_generate_products_order_detail ON "order"; 
 CREATE TRIGGER tr_generate_products_order_detail
 AFTER INSERT
 ON "order"
 FOR EACH ROW
 EXECUTE PROCEDURE generate_products_order_detail();