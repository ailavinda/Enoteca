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

-- \c enoteca_db_test
\c enoteca_db

-- INSERT INTO eno_user (email, password_digest) 

-- VALUES

-- ('flastname-1@lukemail.com', 'FFFFFFccccccABCDEFabcdefABCDEFab')

-- RETURNING id;

INSERT INTO wine_style_ref (stl_name, flavor, food_match, description, image_grp_url, image_style_url)
VALUES 

('Sauvingnon Blanc', 'New Zealand Sauvignon Blanc assails the senses with red capsicum (bell pepper) and gooseberry characters, lush tropical fruit overtones, fresh cut grass, tomato stalks, and grapefruit or lime.
', 'The ''zing'' of Sauvignon Blanc is a delightful complement to the fresh flavours of seafood, shellfish and white fish, and enhances citrus or garlic based sauces. On its own, Sauvignon Blanc is a mouth-watering aperitif, especially on a bright summer''s day. ', 'When Marlborough''s first Sauvignon Blanc vines were planted, no one could have predicted the superstar status that this variety would attain within a couple of decades. Sauvignon Blanc was commercially produced on our shores for the first time in 1979, and is now New Zealand’s most widely planted variety.', '
https://www.nzwine.com/media/1790/wmrbp-1-vineyard-shoot-4.jpg
', 'https://www.nzwine.com/en/our-winestyles/sauvignon-blanc/'),
('Chardonnay', 'A wide-range of Chardonnay styles are produced in New Zealand, from fruit-driven and unoaked, to luscious examples with complexity, elegance, and a touch of oak.', 'A young or unoaked Chardonnay is fabulous with seafood. Mature New Zealand Chardonnays are richer and more complex with stronger toast and nut flavour. Our Chardonnay complements full flavoured savoury dishes such as chicken, veal and rabbit with creamy, garlic or lemon flavoured sauces. The creamy, fruit-driven flavours of mature New Zealand Chardonnay are sublime alongside a dessert of poached pears.', 'New Zealand Chardonnay strongly reflects our unique terroir, and the huge diversity within the different regions. During the 1990s, plantings of this internationally fashionable variety exceeded those of every other grape, today top quality Chardonnay can be found in every region.', 'https://www.nzwine.com/media/1692/s059-161-chardonnay-synposium.DaovcA.jpg', 'https://www.nzwine.com/en/our-winestyles/chardonnay/'),
('Pinot Gris', 'Grown throughout New Zealand, our Pinot Gris is fresh and full-flavoured, with notes of apple, pear, honeysuckle, spice and bread.', 'The gentle acidity and marked fruitiness of a well balanced Pinot Gris perfectly complements roast pork with a stewed pear sauce, or match with creamy pastas, poultry and seafood.', 'Barrel ageing, fermenting with native, wild yeasts, and lees stirring are common winemaking practices in New Zealand to build texture, mouth feel and complexity. Breaking on to the New Zealand scene in the early 1990s, Pinot Gris has enjoyed a dramatic rise to fame and is now our third most popular white variety.', 'https://upload.wikimedia.org/wikipedia/commons/1/13/Pinot_Gris_close.JPG', '
https://www.nzwine.com/en/our-winestyles/pinot-gris/')

RETURNING id;

INSERT INTO wine_region_ref (rgn_name, country, description, image_reg_url, cntr_reg_url)
VALUES 

('Marlborough', 'New Zealand', 'Marlborough wineries offer a huge range of varieties, from exquisite Pinot Noir to intense Chardonnay, and vivacious aromatics. The diverse soils and meso-climates are revealing exciting new sub-regions, and it is within these unique sub-regions that Marlborough''s future lies.', 'https://www.nzwine.com/media/1215/wrv_105_1_marlborough_babich.jpg', 'https://www.nzwine.com/en/our-regions/marlborough/'),
('Hawke''s Bay', 'New Zealand', 'Hawke''s Bay has since earned itself an international reputation for producing high quality Cabernet & Merlot blends, Syrah, Chardonnay, Pinot Noir and an impressive array of aromatic white wines. The warm climate and lengthy growing season also allow for the successful production of dessert wine styles.', 'https://www.nzwine.com/media/1926/wrv_te-mata-estate_08-hawkes-bay.jpg', 'https://www.nzwine.com/en/our-regions/hawkes-bay/'),
('Nelson', 'New Zealand', 'Nelson is a boutique wine region producing outstanding Pinot Noir, Chardonnay, Sauvignon Blanc and aromatics, as well as an impressive mix of emerging varieties. Long renowned for it''s bountiful crops and orchards, Nelson''s wine roots were cultivated in the mid-1800s, when German settlers planted the areas first grape vines to produce wine.', 'https://www.nzwine.com/media/1996/wrv_seifried-brightwater-vineyard-nelson.jpg', '
https://www.nzwine.com/en/our-regions/nelson/')

RETURNING id;


INSERT INTO wine_producer_ref (prdcr_name, wine_region_id, logo_url, affil_company, prdcr_web_url)
VALUES 

('Kim Crawford', '1', 'http://weinfachberater.der-ultes.de/wp-content/uploads/2015/06/kim-crawford-logo-spot.jpg', '', 'http://www.kimcrawfordwines.com/'),
('Hawkes Ridge Wine Estate', '2', 'https://kazzit.com/custom/domain_1/image_files/sitemgr_photo_144452.jpg', '', 'http://www.hawkesridge.co.nz/'),
('Ruby Bay Vineyard', '3', 'https://portal.nzwine.com/uploads/attachments/brandlogos/e5d120ea-7442-47d1-ba59-1f210d11bca2.jpg', '', 'http://www.rubybayvineyard.co.nz/')

RETURNING id;

INSERT INTO wine_product (prdct_name, category, style, origin, package, released_on, description, tasting_note, image_thumb_url, image_url, varietal, sugar_grm_ltr, reg_price_cc, alcohol_cntnt, sugar_cntnt, producer_name)
VALUES 

('Stoneleigh Marlborough Sauvignon Blanc','White Wine','Aromatic & Flavourful','New Zealand, Region Not Specified','750 mL bottle','2016-11-18','Looking for something to please everyone? This famed New Zealand white has classic Sauvignon Blanc flavours of gooseberry, herbs and tropical fruit. It''s excellent with our scallops and chorizo bites.','Looking for something to please everyone? This famed New Zealand white has classic Sauvignon Blanc flavours of gooseberry, herbs and tropical fruit. It''s excellent with our scallops and chorizo bites.','https://dx5vpyka4lqst.cloudfront.net/products/293043/images/thumb.png','https://dx5vpyka4lqst.cloudfront.net/products/293043/images/full.jpeg','Sauvignon Blanc','5','1795','1300','XD - Extra Dry','Pernod Ricard Pacific Pty Ltd')

RETURNING id;

-- UPDATE wine_product SET producer_name = 'Villa Maria Estates Ltd.', prdct_name = 'Villa Maria Private Bin Sauvignon Blanc Marlborough', category = null, style = 'Light & Crisp', origin = 'New Zealand, Marlborough', package = '750 mL bottle', released_on = '2010-09-22', description = null, tasting_note = 'Pale straw colour; intense aromas of gooseberry, lime, grass and asparagus; dry, medium bodied, crisp acidity, and flavours of bell pepper, gooseberry citrus; clean, crisp finish.', image_thumb_url = 'https://dx5vpyka4lqst.cloudfront.net/products/426601/images/thumb.png', image_url = 'https://dx5vpyka4lqst.cloudfront.net/products/426601/images/full.jpeg', varietal = 'Sauvignon Blanc', sugar_grm_ltr = '6', sugar_cntnt = 'XD - Extra Dry', alcohol_cntnt = '1250', reg_price_cc = '1795' WHERE wine_product.id = 7 RETURNING *;



