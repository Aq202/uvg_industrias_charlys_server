drop table if exists order_request, order_request_media, user_account, client_organization, employee,
"session", order_request, "order", order_detail, inventory, requirements, product, product_type, 
"size", material, fabric CASCADE;

CREATE TABLE user_account(
	id_user VARCHAR(15) PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	lastname VARCHAR(100) NOT NULL,
	email VARCHAR(100) NOT NULL UNIQUE,
	phone VARCHAR(15),
	password TEXT,
	sex CHAR NOT NULL,
	id_client_organization VARCHAR(15),
	id_employee VARCHAR(15),
	UNIQUE(id_client_organization, id_employee),
	enabled BOOLEAN DEFAULT true NOT NULL
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
description text,
id_client_organization VARCHAR(15),
"cost" FLOAT
);

CREATE TABLE "size"(
	"size" VARCHAR(10) PRIMARY KEY,
	"sequence" SMALLINT UNIQUE
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
	"size" VARCHAR(10),
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
	"size" VARCHAR(10),
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
	id_temporary_client VARCHAR(15),
	deadline DATE,
	"cost" FLOAT,
	aditional_details TEXT
);

CREATE TABLE order_request_media(
  id_order_request varchar(15) NOT NULL,
  name varchar(1000) NOT NULL
);

CREATE TABLE order_media(
  id_order varchar(15) NOT NULL,
  name varchar(1000) NOT NULL
);

CREATE TABLE alter_user_token(
	id_user VARCHAR(15) NOT NULL,
	token TEXT NOT NULL
);

CREATE TABLE color(
	id_color VARCHAR(15) PRIMARY KEY,
	"name" VARCHAR(100)	NOT NULL,
	red SMALLINT NOT NULL,
	green SMALLINT NOT NULL,
	blue SMALLINT NOT NULL
);

CREATE TABLE product_model(
	id_product_model VARCHAR(15) PRIMARY KEY,
	"type" VARCHAR(15) NOT NULL,
	id_client_organization VARCHAR(15) NOT NULL,
	name VARCHAR(200) NOT NULL,
	details TEXT
);

CREATE TABLE product_model_color(
	id_product_model VARCHAR(15) NOT NULL,
	id_color VARCHAR(15) NOT NULL,
	UNIQUE(id_product_model, id_color)
);

CREATE TABLE product_model_media(
  id_product_model varchar(15) NOT NULL,
  name varchar(1000) NOT NULL
);

