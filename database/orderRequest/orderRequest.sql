create table order_request(
no_request varchar(15) primary key,
customer_name VARCHAR(100) NOT NULL,
customer_email VARCHAR(100),
customer_phone VARCHAR(100),
customer_address VARCHAR(300) NOT null,
description text,
date_placed date
);

CREATE TABLE order_request_media(
  no_request varchar(15) NOT NULL,
  name varchar(1000) NOT NULL
);

alter table order_request
ADD CONSTRAINT check_email CHECK (customer_email ~ '^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$');

ALTER TABLE order_request_media
ADD CONSTRAINT ord_req_media_fk FOREIGN KEY (no_request) REFERENCES order_request(no_request);

/*Función para asignar el nuevo id a la tabla solicitud de orden*/
 CREATE OR REPLACE FUNCTION assign_order_request_no()
 RETURNS trigger as
 $BODY$
 declare prev_id_number integer;
 begin
 	SELECT CAST(SUBSTRING(no_request FROM 3) AS INTEGER) INTO prev_id_number FROM order_request ORDER BY no_request DESC LIMIT 1;
	IF (prev_id_number IS NULL) THEN
		prev_id_number = 0;
		END IF;
	NEW.no_request = CONCAT('OR', LPAD(CAST(prev_id_number + 1 AS VARCHAR), 13, '0'));
	RETURN NEW;
 END;
 $BODY$
 LANGUAGE 'plpgsql';

 DROP TRIGGER IF EXISTS tr_assign_request_no ON order_request; 
 CREATE TRIGGER tr_assign_request_no
 BEFORE INSERT
 ON order_request
 FOR EACH ROW
 EXECUTE PROCEDURE assign_order_request_no();