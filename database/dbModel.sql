drop table if exists user_account, client_organization, employee, session, order_request, "order" CASCADE;

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
no_order varchar(15) primary key,
order_request_no varchar(15),
src_date date,
deadline date,
details text
);

