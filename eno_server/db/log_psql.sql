ool-ad0200c8:eno_server ailavinda$ 
ool-ad0200c8:eno_server ailavinda$ psql -d enoteca_db_test -f ./db/schema.sql
You are now connected to database "enoteca_db_test" as user "ailavinda".
psql:./db/schema.sql:48: NOTICE:  drop cascades to constraint user_wine_comments_eno_user_id_fkey on table user_wine_comments
DROP TABLE
CREATE TABLE
psql:./db/schema.sql:62: NOTICE:  drop cascades to constraint user_wine_comments_wine_prod_id_fkey on table user_wine_comments
DROP TABLE
CREATE TABLE
DROP TABLE
CREATE TABLE
psql:./db/schema.sql:113: NOTICE:  drop cascades to 2 other objects
DETAIL:  drop cascades to constraint wine_producer_ref_wine_region_id_fkey on table wine_producer_ref
drop cascades to constraint wine_product_region_id_fkey on table wine_product
DROP TABLE
CREATE TABLE
psql:./db/schema.sql:131: NOTICE:  drop cascades to constraint wine_product_producer_id_fkey on table wine_product
DROP TABLE
CREATE TABLE
DROP TABLE
CREATE TABLE
ool-ad0200c8:eno_server ailavinda$ psql
psql (10.1)
Type "help" for help.

ailavinda=# \c enoteca_db_test
You are now connected to database "enoteca_db_test" as user "ailavinda".
enoteca_db_test=# 
enoteca_db_test=# 
enoteca_db_test=# \d
                     List of relations
 Schema |           Name            |   Type   |   Owner   
--------+---------------------------+----------+-----------
 public | eno_user                  | table    | ailavinda
 public | eno_user_id_seq           | sequence | ailavinda
 public | user_wine_comments        | table    | ailavinda
 public | user_wine_comments_id_seq | sequence | ailavinda
 public | wine_producer_ref         | table    | ailavinda
 public | wine_producer_ref_id_seq  | sequence | ailavinda
 public | wine_product              | table    | ailavinda
 public | wine_product_id_seq       | sequence | ailavinda
 public | wine_region_ref           | table    | ailavinda
 public | wine_region_ref_id_seq    | sequence | ailavinda
 public | wine_style_ref            | table    | ailavinda
 public | wine_style_ref_id_seq     | sequence | ailavinda
(12 rows)

enoteca_db_test=# 
enoteca_db_test=# \d+ eno_user
                                                               Table "public.eno_user"
     Column      |            Type             | Collation | Nullable |               Default                | Storage  | Stats target | Description 
-----------------+-----------------------------+-----------+----------+--------------------------------------+----------+--------------+-------------
 id              | bigint                      |           | not null | nextval('eno_user_id_seq'::regclass) | plain    |              | 
 email           | character varying           |           | not null |                                      | extended |              | 
 password_digest | character varying           |           | not null |                                      | extended |              | 
 signedup_on     | timestamp without time zone |           |          | CURRENT_TIMESTAMP                    | plain    |              | 
Indexes:
    "eno_user_pkey" PRIMARY KEY, btree (id)
    "eno_user_email_key" UNIQUE CONSTRAINT, btree (email)
Referenced by:
    TABLE "user_wine_comments" CONSTRAINT "user_wine_comments_eno_user_id_fkey" FOREIGN KEY (eno_user_id) REFERENCES eno_user(id)
    TABLE "wine_product" CONSTRAINT "wine_product_eno_user_id_fkey" FOREIGN KEY (eno_user_id) REFERENCES eno_user(id)

enoteca_db_test=#  
enoteca_db_test=# \d+ user_wine_comments
                                                           Table "public.user_wine_comments"
    Column    |          Type           | Collation | Nullable |                    Default                     | Storage  | Stats target | Description 
--------------+-------------------------+-----------+----------+------------------------------------------------+----------+--------------+-------------
 id           | bigint                  |           | not null | nextval('user_wine_comments_id_seq'::regclass) | plain    |              | 
 eno_user_id  | bigint                  |           |          |                                                | plain    |              | 
 wine_prod_id | bigint                  |           |          |                                                | plain    |              | 
 note         | character varying(1023) |           |          |                                                | extended |              | 
 img_note_url | character varying(255)  |           |          |                                                | extended |              | 
Indexes:
    "user_wine_comments_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "user_wine_comments_eno_user_id_fkey" FOREIGN KEY (eno_user_id) REFERENCES eno_user(id)
    "user_wine_comments_wine_prod_id_fkey" FOREIGN KEY (wine_prod_id) REFERENCES wine_product(id)

enoteca_db_test=#  
enoteca_db_test=# \d+ wine_producer_ref
                                                            Table "public.wine_producer_ref"
     Column     |          Type          | Collation | Nullable |                    Default                    | Storage  | Stats target | Description 
----------------+------------------------+-----------+----------+-----------------------------------------------+----------+--------------+-------------
 id             | bigint                 |           | not null | nextval('wine_producer_ref_id_seq'::regclass) | plain    |              | 
 prdcr_name     | character varying(255) |           | not null |                                               | extended |              | 
 wine_region_id | bigint                 |           |          |                                               | plain    |              | 
 logo_url       | character varying(255) |           |          |                                               | extended |              | 
 affil_company  | character varying(255) |           |          |                                               | extended |              | 
 prdcr_web_url  | character varying(255) |           |          |                                               | extended |              | 
Indexes:
    "wine_producer_ref_pkey" PRIMARY KEY, btree (id)
    "wine_producer_ref_prdcr_name_key" UNIQUE CONSTRAINT, btree (prdcr_name)
Foreign-key constraints:
    "wine_producer_ref_wine_region_id_fkey" FOREIGN KEY (wine_region_id) REFERENCES wine_region_ref(id)

enoteca_db_test=# 
enoteca_db_test=# \d+ wine_product
                                                               Table "public.wine_product"
     Column      |            Type             | Collation | Nullable |                 Default                  | Storage  | Stats target | Description 
-----------------+-----------------------------+-----------+----------+------------------------------------------+----------+--------------+-------------
 id              | bigint                      |           | not null | nextval('wine_product_id_seq'::regclass) | plain    |              | 
 eno_user_id     | bigint                      |           |          |                                          | plain    |              | 
 region_id       | bigint                      |           |          |                                          | plain    |              | 
 producer_id     | bigint                      |           |          |                                          | plain    |              | 
 prdct_name      | character varying(255)      |           | not null |                                          | extended |              | 
 category        | character varying(31)       |           |          |                                          | extended |              | 
 stye            | character varying(31)       |           |          |                                          | extended |              | 
 origin          | character varying(255)      |           |          |                                          | extended |              | 
 package_unit    | character varying(31)       |           |          |                                          | extended |              | 
 released_on     | character varying(31)       |           |          |                                          | extended |              | 
 description     | character varying(255)      |           |          |                                          | extended |              | 
 testing_note    | character varying(255)      |           |          |                                          | extended |              | 
 image_thumb_url | character varying(255)      |           |          |                                          | extended |              | 
 image_url       | character varying(255)      |           |          |                                          | extended |              | 
 varietal_grape  | character varying(255)      |           |          |                                          | extended |              | 
 sugar_grm_ltr   | integer                     |           |          |                                          | plain    |              | 
 reg_price_cc    | integer                     |           |          |                                          | plain    |              | 
 record_stamp    | timestamp without time zone |           |          | CURRENT_TIMESTAMP                        | plain    |              | 
Indexes:
    "wine_product_pkey" PRIMARY KEY, btree (id)
    "wine_product_prdct_name_key" UNIQUE CONSTRAINT, btree (prdct_name)
Foreign-key constraints:
    "wine_product_eno_user_id_fkey" FOREIGN KEY (eno_user_id) REFERENCES eno_user(id)
Referenced by:
    TABLE "user_wine_comments" CONSTRAINT "user_wine_comments_wine_prod_id_fkey" FOREIGN KEY (wine_prod_id) REFERENCES wine_product(id)

enoteca_db_test=# 
enoteca_db_test=# \d+ wine_region_ref
                                                           Table "public.wine_region_ref"
    Column     |          Type          | Collation | Nullable |                   Default                   | Storage  | Stats target | Description 
---------------+------------------------+-----------+----------+---------------------------------------------+----------+--------------+-------------
 id            | bigint                 |           | not null | nextval('wine_region_ref_id_seq'::regclass) | plain    |              | 
 rgn_name      | character varying(255) |           | not null |                                             | extended |              | 
 rgn_code      | integer                |           |          | 0                                           | plain    |              | 
 country       | character varying(31)  |           |          |                                             | extended |              | 
 cntr_code     | integer                |           |          | 0                                           | plain    |              | 
 description   | character varying(511) |           |          |                                             | extended |              | 
 image_reg_url | character varying(255) |           |          |                                             | extended |              | 
 cntr_reg_url  | character varying(255) |           |          |                                             | extended |              | 
Indexes:
    "wine_region_ref_pkey" PRIMARY KEY, btree (id)
    "wine_region_ref_rgn_name_key" UNIQUE CONSTRAINT, btree (rgn_name)
Referenced by:
    TABLE "wine_producer_ref" CONSTRAINT "wine_producer_ref_wine_region_id_fkey" FOREIGN KEY (wine_region_id) REFERENCES wine_region_ref(id)

enoteca_db_test=# 
enoteca_db_test=# \d+ wine_style_ref
                                                            Table "public.wine_style_ref"
     Column      |          Type          | Collation | Nullable |                  Default                   | Storage  | Stats target | Description 
-----------------+------------------------+-----------+----------+--------------------------------------------+----------+--------------+-------------
 id              | bigint                 |           | not null | nextval('wine_style_ref_id_seq'::regclass) | plain    |              | 
 stl_name        | character varying(255) |           | not null |                                            | extended |              | 
 flavor          | character varying(255) |           |          |                                            | extended |              | 
 food_match      | character varying(255) |           |          |                                            | extended |              | 
 description     | character varying(255) |           |          |                                            | extended |              | 
 cellar_yrs      | integer                |           |          | 0                                          | plain    |              | 
 cellar_yrs_oak  | integer                |           |          | 0                                          | plain    |              | 
 serv_tmp_fah    | integer                |           |          | 0                                          | plain    |              | 
 image_grp_url   | character varying(255) |           |          |                                            | extended |              | 
 image_style_url | character varying(255) |           |          |                                            | extended |              | 
Indexes:
    "wine_style_ref_pkey" PRIMARY KEY, btree (id)
    "wine_style_ref_stl_name_key" UNIQUE CONSTRAINT, btree (stl_name)

enoteca_db_test=#

ool-ad0200c8:eno_server ailavinda$ 
ool-ad0200c8:eno_server ailavinda$ psql -d enoteca_db_test -f ./db/seeds.sql
You are now connected to database "enoteca_db_test" as user "ailavinda".
 id 
----
  1
(1 row)

INSERT 0 1
 id 
----
  1
  2
  3
(3 rows)

INSERT 0 3
 id 
----
  1
  2
  3
(3 rows)

INSERT 0 3
 id 
----
  1
  2
  3
(3 rows)

INSERT 0 3
ool-ad0200c8:eno_server ailavinda$




ool-ad0200c8:eno_server ailavinda$ 
ool-ad0200c8:eno_server ailavinda$ createdb enoteca_db
ool-ad0200c8:eno_server ailavinda$

ool-ad0200c8:eno_server ailavinda$ psql -d enoteca_db -f ./db/schema.sql
You are now connected to database "enoteca_db" as user "ailavinda".
DROP TABLE
CREATE TABLE
psql:./db/schema.sql:62: NOTICE:  table "wine_product" does not exist, skipping
DROP TABLE
CREATE TABLE
DROP TABLE
CREATE TABLE
psql:./db/schema.sql:113: NOTICE:  drop cascades to 2 other objects
DETAIL:  drop cascades to constraint wine_producer_ref_wine_region_id_fkey on table wine_producer_ref
drop cascades to constraint wine_product_region_id_fkey on table wine_product
DROP TABLE
CREATE TABLE
psql:./db/schema.sql:131: NOTICE:  drop cascades to constraint wine_product_producer_id_fkey on table wine_product
DROP TABLE
CREATE TABLE
psql:./db/schema.sql:149: NOTICE:  table "user_wine_comments" does not exist, skipping
DROP TABLE
CREATE TABLE
ool-ad0200c8:eno_server ailavinda$ psql -d enoteca_db -f ./db/seeds.sql
You are now connected to database "enoteca_db" as user "ailavinda".
 id 
----
  1
(1 row)

INSERT 0 1
 id 
----
  1
  2
  3
(3 rows)

INSERT 0 3
 id 
----
  1
  2
  3
(3 rows)

INSERT 0 3
 id 
----
  1
  2
  3
(3 rows)

INSERT 0 3
ool-ad0200c8:eno_server ailavinda$ 


-- Modification of wine_product table on Mar 12...


enoteca_db=# 

enoteca_db=# 
enoteca_db=# 
enoteca_db=# DROP TABLE IF EXISTS wine_product CASCADE;
DROP TABLE
enoteca_db=# 
enoteca_db=# CREATE TABLE wine_product (
enoteca_db(#   id              BIGSERIAL     PRIMARY KEY,
enoteca_db(#   -- eno_user_id     BIGINT        REFERENCES eno_user (id),
enoteca_db(#   -- region_id       BIGINT        REFERENCES wine_region_ref (id),
enoteca_db(#   -- producer_id     BIGINT        REFERENCES wine_producer_ref (id),
enoteca_db(#   producer_name   VARCHAR(255),
enoteca_db(#   prdct_name      VARCHAR(255)  NOT NULL UNIQUE,
enoteca_db(#   category        VARCHAR(31),
enoteca_db(#   style           VARCHAR(31),
enoteca_db(#   origin          VARCHAR(255),
enoteca_db(#   package         VARCHAR(31),
enoteca_db(#   released_on     VARCHAR(31),
enoteca_db(#   description     VARCHAR(511),
enoteca_db(#   tasting_note    VARCHAR(511),
enoteca_db(#   image_thumb_url VARCHAR(511),
enoteca_db(#   image_url       VARCHAR(511),
enoteca_db(#   varietal        VARCHAR(255),
enoteca_db(#   sugar_grm_ltr   VARCHAR(16),
enoteca_db(#   sugar_cntnt     VARCHAR(31),
enoteca_db(#   alcohol_cntnt   VARCHAR(16),
enoteca_db(#   reg_price_cc    VARCHAR(16),
enoteca_db(#   record_stamp    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
enoteca_db(# );
CREATE TABLE
enoteca_db=#                                           



enoteca_db=# 
enoteca_db=# INSERT INTO wine_product (prdct_name, category, style, origin, package, released_on, description, tasting_note, image_thumb_url, image_url, varietal, sugar_grm_ltr, reg_price_cc, alcohol_cntnt, sugar_cntnt, producer_name)
enoteca_db-# VALUES 
enoteca_db-# 
enoteca_db-# ('Stoneleigh Marlborough Sauvignon Blanc','White Wine','Aromatic & Flavourful','New Zealand, Region Not Specified','750 mL bottle','2016-11-18','Looking for something to please everyone? This famed New Zealand white has classic Sauvignon Blanc flavours of gooseberry, herbs and tropical fruit. It''s excellent with our scallops and chorizo bites.','Looking for something to please everyone? This famed New Zealand white has classic Sauvignon Blanc flavours of gooseberry, herbs and tropical fruit. It''s excellent with our scallops and chorizo bites.','https://dx5vpyka4lqst.cloudfront.net/products/293043/images/thumb.png','https://dx5vpyka4lqst.cloudfront.net/products/293043/images/full.jpeg','Sauvignon Blanc','5','XD - Extra Dry','1300','1795','Pernod Ricard Pacific Pty Ltd')
enoteca_db-# 
enoteca_db-# RETURNING id;
 id 
----
  1
(1 row)

INSERT 0 1
enoteca_db=# SELECT * FROM wine_product;
 id |         producer_name         |               prdct_name               |  category  |         style         |              origin               |    package    | released_on |                                                                                               description                                                                                                |                                                                                               tasting_note                                                                                               |                            image_thumb_url                            |                               image_url                               |    varietal     | sugar_grm_ltr | sugar_cntnt | alcohol_cntnt |  reg_price_cc  |        record_stamp        
----+-------------------------------+----------------------------------------+------------+-----------------------+-----------------------------------+---------------+-------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------------+-----------------------------------------------------------------------+-----------------+---------------+-------------+---------------+----------------+----------------------------
  1 | Pernod Ricard Pacific Pty Ltd | Stoneleigh Marlborough Sauvignon Blanc | White Wine | Aromatic & Flavourful | New Zealand, Region Not Specified | 750 mL bottle | 2016-11-18  | Looking for something to please everyone? This famed New Zealand white has classic Sauvignon Blanc flavours of gooseberry, herbs and tropical fruit. It's excellent with our scallops and chorizo bites. | Looking for something to please everyone? This famed New Zealand white has classic Sauvignon Blanc flavours of gooseberry, herbs and tropical fruit. It's excellent with our scallops and chorizo bites. | https://dx5vpyka4lqst.cloudfront.net/products/293043/images/thumb.png | https://dx5vpyka4lqst.cloudfront.net/products/293043/images/full.jpeg | Sauvignon Blanc | 5             | 1795        | 1300          | XD - Extra Dry | 2018-03-13 01:30:33.953831
(1 row)

enoteca_db=# 


