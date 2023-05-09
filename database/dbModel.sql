drop table if exists user_account, client_organization, employee CASCADE;

CREATE TABLE user_account(
	id_user VARCHAR(15) PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	lastname VARCHAR(100) NOT NULL,
	email VARCHAR(100) NOT NULL UNIQUE,
	phone VARCHAR(15),
	password TEXT NOT NULL,
	sex CHAR NOT NULL,
	id_client_organization VARCHAR(15) UNIQUE,
	id_employee VARCHAR(15) UNIQUE
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
