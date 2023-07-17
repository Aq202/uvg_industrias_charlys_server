drop table if exists order_request, order_request_media user_account, client_organization, employee,
"session", order_request, "order", order_detail, inventory, requirements, product, product_type, 
"size", material, fabric CASCADE;

CREATE TABLE user_account(
	id_user VARCHAR(15) PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	lastname VARCHAR(100) NOT NULL,
	email VARCHAR(100) NOT NULL UNIQUE,
	phone VARCHAR(15),
	password TEXT NOT NULL,
	sex CHAR NOT NULL,
	id_client_organization VARCHAR(15),
	id_employee VARCHAR(15),
	UNIQUE(id_client_organization, id_employee)
);

CREATE TABLE client_organization(
	id_client_organization VARCHAR(15) PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	email VARCHAR(100),
	phone VARCHAR(100),
	address VARCHAR(300) NOT NULL
);

CREATE TABLE employee(
	id_employee VARCHAR(15) PRIMARY KEY,
	role varchar(15) NOT NULL
);

CREATE TABLE session(
	id_user VARCHAR(15) NOT NULL,
	token TEXT NOT NULL
);

create table "order"(
id_order varchar(15) primary key,
id_order_request varchar(15),
deadline date,
details text,
id_client_organization VARCHAR(15)
);

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
		name VARCHAR(200) NOT NULL,
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

CREATE TABLE temporary_client(
	id_temporary_client VARCHAR(15) primary key,
	name VARCHAR(100) NOT NULL,
	email VARCHAR(100) NOT NULL,
	phone VARCHAR(15),
	address VARCHAR(200) NOT NULL
);

create table order_request(
	id_order_request varchar(15) primary key,
	description text,
	date_placed date,
	id_client_organization VARCHAR(15),
	id_temporary_client VARCHAR(15)
);

CREATE TABLE order_request_media(
  id_order_request varchar(15) NOT NULL,
  name varchar(1000) NOT NULL
);

