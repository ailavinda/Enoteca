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






