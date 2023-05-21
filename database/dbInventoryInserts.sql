INSERT INTO "size"("size") VALUES('4'),('6'),('8'),('10'),('12'),('14'),('16'),('S'),('M'),('L'),
	('XL'),('XXL'),('XXXL'),('XXXXL');

INSERT INTO product_type("name") VALUES('polo'),('playera'),('pants'),('chumpa'),('suéter'),('chaleco');

INSERT INTO product("type", client, color) VALUES('PT0000000000001', 1, 'rojo');

INSERT INTO material(description)
	VALUES('botón metálico rojo'),('zipper negro'),('botón plástico azul'),('remache'),('zipper verde');
	
INSERT INTO fabric(fabric, color) VALUES('seda','rojo'),('Seda', 'Azul'), ('Algodón', 'Verde'), ('Lino', 'Blanco'),
	('Poliéster', 'Negro'), ('Franela', 'Gris'), ('Terciopelo', 'Morado'), ('Denim', 'Azul Oscuro'), ('Corduroy', 'Marrón'),
	('Satén', 'Rojo'), ('Encaje', 'Crema'), ('Cuero', 'Café'), ('Chiffon', 'Rosa'), ('Tweed', 'Gris Claro'),
	('Pana', 'Beige'), ('Brocado', 'Dorado');

INSERT INTO inventory(material, fabric, product, "size", quantity)
	VALUES('MAT000000000001',null,null,null,30),
	(null,'F00000000000001',null,NULL,15.5),
	(null,null,'P00000000000001','S00000000000001',5);

INSERT INTO requirements VALUES('P00000000000001','S00000000000001','MAT000000000001',NULL,15),
	('P00000000000001','S00000000000001',NULL,'F00000000000001',15.5);

INSERT INTO "order" VALUES(NULL, 'OR0000000000001', now(),now(),'Esto es una prueba');

INSERT INTO order_request VALUES(null, 'Prueba','prueba@gmail.com','12345678','Zona 10', 'Esto es una prueba', now());

INSERT INTO order_detail values('O00000000000001','P00000000000001','S00000000000001',10);