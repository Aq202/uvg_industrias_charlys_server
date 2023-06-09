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