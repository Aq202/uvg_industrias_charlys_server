DROP TABLE IF EXISTS order_detail, inventory, requirements, product, product_type, "size", material, fabric;

CREATE TABLE "size"(
	"id_size" VARCHAR(15) PRIMARY KEY,
	"size" VARCHAR(10)
);

CREATE TABLE product_type(
	id_product_type VARCHAR(15) PRIMARY KEY,
	"name" VARCHAR(100)
);

CREATE TABLE product(
	id_product VARCHAR(15) PRIMARY KEY,
	"type" VARCHAR(15),
	client VARCHAR(15),
	color VARCHAR(100)
);

CREATE TABLE order_detail(
	no_order VARCHAR(15),
	product VARCHAR(15),
	"size" VARCHAR(15),
	quantity INT,
	PRIMARY KEY(no_order, product, "size")
);

	CREATE TABLE material(
		id_material VARCHAR(15) PRIMARY KEY,
		description VARCHAR(500),
		supplier VARCHAR(100),
		color VARCHAR(100),
		type INTEGER NOT NULL
	);

	CREATE TABLE material_type(
		id_material_type SERIAL PRIMARY KEY,
		name VARCHAR(200) NOT NULL
	);


CREATE TABLE inventory(
	id_inventory VARCHAR(15) PRIMARY KEY,
	material VARCHAR(15) UNIQUE,
	product VARCHAR(15) UNIQUE,
	quantity FLOAT NOT NULL DEFAULT 0,
	measurement_unit VARCHAR(100) NOT NULL,
	details VARCHAR(500)
);

CREATE TABLE requirements(
	product VARCHAR(15),
	"size" VARCHAR(15),
	material VARCHAR(15),
	fabric VARCHAR(15),
	quantity_per_unit FLOAT
);