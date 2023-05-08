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