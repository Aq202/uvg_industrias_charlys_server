ALTER TABLE user_account 
ADD CONSTRAINT user_corg_fk FOREIGN KEY (id_client_organization) REFERENCES client_organization(id_client_organization),
ADD CONSTRAINT user_employee_fk FOREIGN KEY (id_employee) REFERENCES employee(id_employee),
ADD CONSTRAINT check_email CHECK (email ~ '^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$'),
ADD CONSTRAINT check_sex CHECK (sex = 'M' OR sex = 'F'),
ADD CONSTRAINT check_role CHECK ((id_client_organization IS NULL AND id_employee IS NOT NULL) OR (id_client_organization IS NOT NULL AND id_employee IS NULL));

ALTER TABLE client_organization
ADD CONSTRAINT corg_check_email CHECK (email ~ '^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$');

ALTER TABLE employee
ADD CONSTRAINT employee_check_role CHECK (role IN ('ADMIN', 'PRODUCTION', 'SALES'));

ALTER TABLE "session"
ADD CONSTRAINT session_user_fk FOREIGN KEY (id_user) REFERENCES user_account(id_user);

ALTER TABLE "order"
ADD CONSTRAINT order_fk FOREIGN KEY (id_order_request) REFERENCES order_request(id_order_request),
ADD CONSTRAINT order_client_fk FOREIGN KEY (id_client_organization) REFERENCES client_organization(id_client_organization);


ALTER TABLE "order_detail" 
ADD CONSTRAINT orderd_order_fk FOREIGN KEY (no_order) REFERENCES "order"(no_order),
ADD CONSTRAINT orderd_product_fk FOREIGN KEY (product) REFERENCES product(id_product),
ADD CONSTRAINT orderd_size_fk FOREIGN KEY ("size") REFERENCES size(id_size);

ALTER TABLE material
ADD CONSTRAINT material_type_fk FOREIGN KEY (type) REFERENCES material_type(id_material_type);

ALTER TABLE inventory 
ADD CONSTRAINT inventory_material_fk FOREIGN KEY (material) REFERENCES material(id_material),
ADD CONSTRAINT inventory_product_fk FOREIGN KEY (product) REFERENCES product(id_product),
ADD CONSTRAINT check_element CHECK (
	(material IS NULL AND product IS NOT NULL)
	OR (material IS NOT NULL AND product IS NULL)
);

ALTER TABLE requirements
ADD CONSTRAINT requirement_material_fk FOREIGN KEY (material) REFERENCES material(id_material),
ADD CONSTRAINT requirement_fabric_fk FOREIGN KEY (fabric) REFERENCES fabric(id_fabric),
ADD CONSTRAINT requirement_product_fk FOREIGN KEY (product) REFERENCES product(id_product),
ADD CONSTRAINT requirement_size_fk FOREIGN KEY ("size") REFERENCES size(id_size),
ADD CONSTRAINT requirement_unique_material UNIQUE(product, "size", material),
ADD CONSTRAINT requirement_unique_fabric UNIQUE(product, "size", fabric),
ADD CONSTRAINT check_requirement CHECK (
	(material IS NULL AND fabric IS NOT NULL)
	OR (material IS NOT NULL AND fabric IS NULL AND FLOOR(quantity_per_unit) = quantity_per_unit)
);

ALTER TABLE product
ADD CONSTRAINT product_ptype_fk FOREIGN KEY ("type") REFERENCES product_type(id_product_type),
ADD CONSTRAINT product_client_fk FOREIGN KEY (client) REFERENCES client_organization(id_client_organization);

ALTER TABLE order_request
ADD CONSTRAINT client_organization_fk FOREIGN KEY (id_client_organization) REFERENCES client_organization(id_client_organization),
ADD CONSTRAINT temporary_client_fk FOREIGN KEY (id_temporary_client) REFERENCES temporary_client(id_temporary_client);
ADD CONSTRAINT client_or_temporary_check CHECK ((id_client_organization IS NULL AND id_temporary_client IS NOT NULL) 
	OR (id_client_organization IS NOT NULL AND id_temporary_client IS NULL) 
	OR (id_client_organization IS NULL AND id_temporary_client IS NULL));


ALTER TABLE order_request_media
ADD CONSTRAINT ord_req_media_fk FOREIGN KEY (id_order_request) REFERENCES order_request(id_order_request);

ALTER TABLE order_media
ADD CONSTRAINT ord_media_fk FOREIGN KEY (id_order) REFERENCES "order"(id_order);

ALTER TABLE temporary_client 
ADD CONSTRAINT temp_client_check_email CHECK (email ~ '^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$');

ALTER TABLE alter_user_token
ADD CONSTRAINT alterUserTkn_user_fk FOREIGN KEY (id_user) REFERENCES user_account(id_user);