-----------------------------------------------------------
-----------------------------------------------------------
-- PROJECT_4, Title: Enoteca,                            -- 
-- Student: Anatoliy Lavinda.                            --
-- March 08, 2018                                        --
-- GA, New York                                          --
--                                                       --
--    Instructors:                                       --
--        Tims Gardner                                   --
--        Drake Tally                                    --
--        Dominic Farquharson                            --
--                                                       --
-----------------------------------------------------------
--                                                       --
-- File belongs to eno_server/db directory...            --
--                                                       --
-----------------------------------------------------------  
-----------------------------------------------------------
--                                                       --
-- The database is named after the title of the          -- 
-- project...                                            --
--                                                       --
-- Outside of db folder please run:                      --
--                                                       --
-- createdb enoteca_db                                   --
-- psql -d enoteca_db -f schema.sql                      --
--                                                       --
-- then:                                                 --
-- psql -d enoteca_db -f seeds.sql                       --
--                                                       --
-----------------------------------------------------------
-- for testing:                                          --
--                                                       --
-- createdb enoteca_db_test                              --
-- psql -d enoteca_db_test -f schema.sql                 --
--                                                       --
-- then:                                                 --
-- psql -d enoteca_db_test -f seeds.sql                  --
-----------------------------------------------------------
-- \c enoteca_db_test
\c enoteca_db
-----------------------------------------------------------
-- USER table is to keep user's requisites during        --
-- sign-up. There might be some other connections        --
-- later on...                                           --
-----------------------------------------------------------

DROP TABLE IF EXISTS eno_user CASCADE;
CREATE TABLE eno_user (
  id              BIGSERIAL     PRIMARY KEY,
  email           VARCHAR       NOT NULL UNIQUE,
  password_digest VARCHAR       NOT NULL,
  signedup_on     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-----------------------------------------------------------
-- WINE_PRODUCT table reflects a package label info      --
-- in user posession. Could be populated from LCBO API,  -- 
-- or manually...                                        --
-----------------------------------------------------------

DROP TABLE IF EXISTS wine_product CASCADE;

CREATE TABLE wine_product (
  id              BIGSERIAL     PRIMARY KEY,
  -- eno_user_id     BIGINT        REFERENCES eno_user (id),
  -- region_id       BIGINT        REFERENCES wine_region_ref (id),
  -- producer_id     BIGINT        REFERENCES wine_producer_ref (id),
  producer_name   VARCHAR(255),
  prdct_name      VARCHAR(255)  NOT NULL UNIQUE,
  category        VARCHAR(31),
  style           VARCHAR(31),
  origin          VARCHAR(255),
  package         VARCHAR(31),
  released_on     VARCHAR(31),
  description     VARCHAR(511),
  tasting_note    VARCHAR(511),
  image_thumb_url VARCHAR(511),
  image_url       VARCHAR(511),
  varietal        VARCHAR(255),
  sugar_grm_ltr   VARCHAR(16),
  sugar_cntnt     VARCHAR(31),
  alcohol_cntnt   VARCHAR(16),
  reg_price_cc    VARCHAR(16),
  record_stamp    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-----------------------------------------------------------
-- WINE_STYLE_REF table keeps imporatant characteristics --
-- of a wine product style...                            --
-----------------------------------------------------------

DROP TABLE IF EXISTS wine_style_ref CASCADE;

CREATE TABLE wine_style_ref (
  id              BIGSERIAL     PRIMARY KEY,
  stl_name        VARCHAR(255)  NOT NULL UNIQUE,
  flavor          VARCHAR(255),
  food_match      VARCHAR(511),
  description     VARCHAR(511),
  cellar_yrs      INTEGER         DEFAULT 0,
  cellar_yrs_oak  INTEGER         DEFAULT 0,
  serv_tmp_fah    INTEGER         DEFAULT 0,
  image_grp_url   VARCHAR(255),
  image_style_url VARCHAR(255)
);

-----------------------------------------------------------
-- REGION_REF is a reference table to hold place of the  -- 
-- wine product origination. This table might be a base  -- 
-- for groupping the producers.                          --
-- "description" might be a 'dump' place for the geo     --
-- and the weather conditions...                         --
-----------------------------------------------------------

DROP TABLE IF EXISTS wine_region_ref CASCADE;

CREATE TABLE wine_region_ref (
  id            BIGSERIAL       PRIMARY KEY,
  rgn_name      VARCHAR(255)    NOT NULL UNIQUE,
  rgn_code      INTEGER         DEFAULT 0,
  country       VARCHAR(31),
  cntr_code     INTEGER         DEFAULT 0,
  description   VARCHAR(511),
  image_reg_url VARCHAR(255),
  cntr_reg_url  VARCHAR(255)
);

-----------------------------------------------------------
-- PRODUCER_REF table holds all the relevant names of    -- 
-- producers of the wine products...                     --
-----------------------------------------------------------

DROP TABLE IF EXISTS wine_producer_ref CASCADE;

CREATE TABLE wine_producer_ref (
  id              BIGSERIAL       PRIMARY KEY,
  prdcr_name      VARCHAR(255)    NOT NULL UNIQUE,
  wine_region_id  BIGINT          REFERENCES wine_region_ref (id),
  logo_url        VARCHAR(255),
  affil_company   VARCHAR(255),
  prdcr_web_url   VARCHAR(255)
);

-----------------------------------------------------------
-- USER_WINE_COMMENTS table will allow to save notes and --
-- relevant image url by particular user...              --
-- This table is not a part of original MVP and is       -- 
-- a possible extention of the project...                --
-----------------------------------------------------------

DROP TABLE IF EXISTS user_wine_comments CASCADE;

CREATE TABLE user_wine_comments (
  id            BIGSERIAL       PRIMARY KEY,
  eno_user_id   BIGINT          REFERENCES eno_user (id),
  wine_prod_id  BIGINT          REFERENCES wine_product (id),
  note          VARCHAR(1023),
  img_note_url  VARCHAR(255)
);

-----------------------------------------------------------