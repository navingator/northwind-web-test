
-- Create a sequence to generate product IDs
CREATE SEQUENCE products_id_seq START WITH 100;

ALTER TABLE products ALTER COLUMN productid SET DEFAULT nextval('products_id_seq'::regclass);
ALTER TABLE products ADD UNIQUE (productname);
ALTER TABLE products ALTER COLUMN categoryid SET NOT NULL;
ALTER TABLE products ALTER COLUMN discontinued TYPE bool USING CASE WHEN discontinued=0 THEN FALSE ELSE TRUE END;
ALTER TABLE products ALTER COLUMN discontinued SET DEFAULT 'f';
ALTER TABLE products ALTER COLUMN productname TYPE text;
ALTER TABLE products ADD CONSTRAINT products_productname_check CHECK (length(productname) > 0 AND length(productname) <= 40);

ALTER TABLE products DROP COLUMN supplierid;
ALTER TABLE products DROP COLUMN quantityperunit;
ALTER TABLE products DROP COLUMN unitsonorder;
ALTER TABLE products DROP COLUMN reorderlevel;
