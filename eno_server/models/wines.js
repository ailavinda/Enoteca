/////////////////////////////////////////////////
//                                             //
//    PROJECT_4, Title: Enoteca,               //
//    Student: Anatoliy Lavinda                //
//    GA, New York                             //
//    March 08, 2018                           //
//                                             //
//    Instructors:                             //
//        Tims Gardner                         //
//        Drake Tally                          //
//        Dominic Farquharson                  //
//                                             //
/////////////////////////////////////////////////
//                                             //
// Belongs to eno_server/models directory...   //
//                                             //
/////////////////////////////////////////////////

const dotenv = require('dotenv').config();
const db = require("../db/index.js");

// Need incorporate axios to call on
// external API (LCBO - wine products). 
// There going to be quite a number of records, 
// which need to be filtered by user entered
// parameters of search (like "white wines") 
// and then entered into DB on user request...
const axios = require("axios");

// Table articles within find_the_book DB...
// Fields from guardian API are on the right...
// artcl_web_id      = id,
// artcl_type        = type,
// artcl_section     = sectionId,
// artcl_head        = headline,
// artcl_author      = byline,
// artcl_web_date    = webPublicationDate,
// artcl_wrds        = wordcount,
// artcl_chrs        = charCount,
// artcl_thumb       = thumbnail,
// artcl_web_url     = webUrl,
// artcl_api_url     = apiUrl,
// artcl_short_url   = shortUrl,
// artcl_trail       = trailText,
// artcl_body_text   = bodyText

// To iterate through the data from LCBO, use:
// response.results[i].apiUrl
// and construct another request for a single 
// wine product record...

const winesMdl = {};

////////////////////////////////////////////////////
// userWineMdl is by T.Gardner example...         //
// Please see below                               //
////////////////////////////////////////////////////
// userWineMdl is a special case for handling
// user_wine_commemts model.
// This functionality is not a part of MVP...
const userWinesMdl = {};
////////////////////////////////////////////////////
// userWineMdl is by T.Gardner example...         //
// Please see below                               //
////////////////////////////////////////////////////


const apiKey = "&access_key=" + process.env.API_KEY;
// const allFlds = "?show-fields=all";

// Functions to get LCBO API data...

function sortThroughWine(arrData) {
  // Loop through all the results of the first response
  // and filter data according to user request...

  console.log("In sortThroughWine - API results processing...");

  var arrDt = [];
  var proms = [];
  var promsDB = [];
  var wineObj = {};

  console.log(arrData.length);

  // arrResults.forEach(rcrd => {
  for (let i = 0; i < arrData.length; i++) {
    // console.log(arrData[i].apiUrl);

    wineObj.id = arrData[i].id;
    wineObj.type = arrData[i].type;
    wineObj.webTitle = arrData[i].webTitle;
    wineObj.webPubl = arrData[i].webPublicationDate;
    wineObj.webUrl = arrData[i].webUrl;
    wineObj.apiUrl = arrData[i].apiUrl;
    wineObj.section = arrData[i].sectionId;

    // console.log(artObj);

    arrDt.push(wineObj);
    wineObj = {};
    
  }
  
  // console.log(arrDt);
  // console.log(arrDt.length);

  // Using apiWeb to fetch entire article from theguardian...

  for (let i = 0; i < arrDt.length; i++) {
    
    var wineUrl = `${arrDt[i].apiUrl}${apiKey}`;
    
    proms.push(axios.get(wineUrl));

  }
  
  ///////////////////////////////////////////////////////////////////
  // The use of .all method with array of promises is according to:
  // https://stackoverflow.com/questions/37213783/waiting-for-all-promises-called-in-a-loop-to-finish
  // #18...
  ///////////////////////////////////////////////////////////////////

  axios
    .all(proms)
    // axios({
    //   method: "get",
    //   url: `${artUrl}${allFlds}${apiKey}`
    // })
    .then(function(reslts) {
      console.log("This is 'then' point of the second axios...");
      
      // console.log(JSON.stringify(reslts));
      // console.log(reslts);

      for (let i = 0; i < reslts.length; i++) {
        let res = reslts[i];
        
        let rsp = res.data.response.content.fields;

        arrDt[i].author = rsp.byline;

        arrDt[i].wrds = rsp.wordcount * 1;

        arrDt[i].chrs = rsp.charCount * 1;

        arrDt[i].thumb = rsp.thumbnail;

        arrDt[i].trail = rsp.trailText;
        
        arrDt[i].short_url = rsp.shortUrl;

        arrDt[i].body_text = rsp.bodyText;

        console.log('Second axios, at "then" point...');
        
      }

      console.log(JSON.stringify(arrDt));

      console.log("--------------------------------");
      console.log("in the for loop over arrDt");

      for (let i = 0; i < arrDt.length; i++) {

        promsDB.push(
          db.one(
            "INSERT INTO wine_product (artcl_web_id, artcl_type, artcl_section, artcl_head, artcl_author, artcl_web_date, artcl_wrds, artcl_chrs, artcl_thumb, artcl_web_url, artcl_api_url, artcl_short_url, artcl_trail, artcl_body_text) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id;",
            [
              arrDt[i].id,
              arrDt[i].type,
              arrDt[i].section,
              arrDt[i].webTitle,
              arrDt[i].author,
              arrDt[i].webPubl,
              arrDt[i].wrds,
              arrDt[i].chrs,
              arrDt[i].thumb,
              arrDt[i].webUrl,
              arrDt[i].apiUrl,
              arrDt[i].short_url,
              arrDt[i].trail,
              arrDt[i].body_text
            ]
          )
        );
      }
      console.log("---------------------------------");
      console.log("after the for loop over arrDt");

      console.log(JSON.stringify(promsDB));

      Promise
        .all(promsDB)
        .then(result => {
          console.log('wines seed complete');
          console.log(JSON.stringify(arrDt));
          //next();
        })
        .catch(err => {
          console.log("Error: in sortThroughWine(): Details: ", err);
          // next(err);
        });

      
    })
    .catch(err => {
      console.log("Error: in sortThroughWine()/axios. Details: ", err);
    });

  // return arrDt;
}


// The special route /wines/search allows user 
// to enter search parameters, fetch data from API
// and then mark some of them to be saved into DB...
winesMdl.allWines = (req, res, next) => {
  // This is an initial use of axios call to
  // LCBO API...

  console.log("In winesMdl.allWines... models/wines");

  // Get rid of spaces in user's input...
  // That is, if input exists...
  var prm_srch;
  var cntr_srch;
  // The search parameters is for "wine" and its color...
  // The LCBO API provides info about all kind of bevergages,
  // so, there is a need for filtering for "wines"...
  if (req.body.param_srch) {
    prm_srch = req.body.param_srch.trim().replace(" ", "+");
  } else {
    prm_srch = `white+wine`;
  }
  // Need a second input field for country of origin,
  // like "New Zealand"...
  if (req.body.country_srch) {
    cntr_srch = req.body.country_srch.trim();
    console.log('Coutry: ', cntr_srch);
  } else {
    cntr_srch = `New Zealand`;
  }

  // The API url...
  var urlLCBO = "http://lcboapi.com/products?";

  // The number of recordes per hit goes right after
  // "products?"...
  const pageSz = "per_page=100&";

  // This is next, user's "query" input like "white+wine"...
  var queryLn = `q=${prm_srch}`;

  // Next is apiKey (&access_key=), see above,
  // around line 68...

  // Current page is the last in the URL string.
  // API provides info for "current page", "next 
  // page", "total pages", and, actually, gives 
  // entire URL string for the next page except
  // urlLCBO...
  const pageCurr = "&page=";

  // We want to be able incrementing the page,
  // just in case...
  var pgNum = 1;
  var pgCrr = pageCurr + pgNum;

  axios({
    method: "get",
    url: `${urlLCBO}${pageSz}${queryLn}${apiKey}${pgCrr}`
  })
    .then(respns => {

      // Here comes the first page of data...
      var winesRes = respns.data;

      // Response has a "pager" object...
      var objPager = winesRes.pager;
      var ttlPages = objPager.total_pages;
      var nxtPage = objPager.next_page;
      var nxtUrl = objPager.next_page_path;

      // ...and the "result" array...
      var arrReslt = winesRes.result;
      // Later on we are going to passw this array
      // sortThroughWines function, so below code
      // lines would be moved into the funcion.
      // This will make it possible to make several
      // axios calls witnin the function...
      // The old function is an example of making 
      // .all promises pushed into an array, but 
      // this is not our intention and goes beyond
      // MVP...

      // This array is used to filter by "country"...
      var arrCntrRslt = [];
      var aCnRs = [];
      var arrItem = {};
      var aIt = {};

      for (let i = 0; i < arrReslt.length; i++) {

        if (arrReslt[i].origin.indexOf(cntr_srch) !== -1) {
          console.log("Found New Zealand: ", {name: `${arrReslt[i].name}`});
          // Collecting dual-sets of data:
          // One - to be ready for insertion into DB;
          // Another - for user to see and mark them
          // for insertion...
          arrItem.name = arrReslt[i].name.replace("'", "''", 'g');
          aIt.name = arrReslt[i].name.replace("'", "''", 'g');
          
          arrItem.regular_price_in_cents = '' + arrReslt[i].regular_price_in_cents;
          arrItem.secondary_category = arrReslt[i].secondary_category;
          arrItem.origin = arrReslt[i].origin.replace("'", "''", 'g');
          aIt.origin = arrReslt[i].origin.replace("'", "''", 'g');
          
          arrItem.package = arrReslt[i].package.replace("'", "''", 'g');
          arrItem.alcohol_content = '' + arrReslt[i].alcohol_content;
          arrItem.sugar_content = arrReslt[i].sugar_content;
          arrItem.producer_name = arrReslt[i].producer_name === null ? null : arrReslt[i].producer_name.replace("'", "''", 'g');
          arrItem.released_on = arrReslt[i].released_on;
          aIt.released_on = arrReslt[i].released_on;
          
          arrItem.description = arrReslt[i].description === null ? null : arrReslt[i].description.replace("'", "''", 'g');
          // arrItem.serving_suggestion = arrReslt[i].serving_suggestion;
          arrItem.tasting_note = arrReslt[i].tasting_note === null ? null : arrReslt[i].tasting_note.replace("'", "''", 'g');
          arrItem.image_thumb_url = arrReslt[i].image_thumb_url;
          aIt.image_thumb_url = arrReslt[i].image_thumb_url;
          aIt.regular_price_in_cents = '' + arrReslt[i].regular_price_in_cents;
          
          arrItem.image_url = arrReslt[i].image_url;
          aIt.image_url = arrReslt[i].image_url;
          
          arrItem.varietal = arrReslt[i].varietal.replace("'", "''", 'g');
          arrItem.style = arrReslt[i].style.replace("'", "''", 'g');
          arrItem.sugar_in_grams_per_liter = '' + arrReslt[i].sugar_in_grams_per_liter;
          
          arrCntrRslt.push(arrItem);
          aCnRs.push(aIt);
          // console.log("name: ", JSON.stringify(aIt.name));
          // console.log("array of objects: ", JSON.stringify(aCnRs));
          arrItem = {};
          aIt = {};
        }

      }
      res.locals.wnsAPIdt = arrCntrRslt;
      console.log(res.locals.wnsAPIdt);
      // 
      // Calling a function to fetch additional data...
      // res.locals.wnsAPIdt = sortThroughWine(arrReslt);
      // console.log(JSON.stringify(res.locals.wnsAPIdt));

      next();
    })
    .catch(error => {
      console.log("Error: in winesMdl.allWines. Details: ", error);
      next(error);
    });
};

///////////////////////////////////////////////////////
//    Show all records in wine_product DB            //
///////////////////////////////////////////////////////
winesMdl.allDBwines = (req, res, next) => {
  console.log('In winesMdl.allDBwines, res.locals: ', JSON.stringify(res.locals));
  db
    .manyOrNone("SELECT * FROM wine_product;")
    .then(result => {
      res.locals.winesDB = result;
      console.log('This is the "result" from DB: ', JSON.stringify(result));
      console.log('This is the "res.locals.winesDB" from DB: ',JSON.stringify(res.locals.winesDB));
      next();
    })
    .catch(err => {
      console.log('Error: in winesMdl.allDBwines. Details: ', err);
      next(err);
    });
};

///////////////////////////////////////////////////////
//          Show single record from DB               //
///////////////////////////////////////////////////////
winesMdl.findById = (req, res, next) => {
  // .wineId is provided by HTML route...
  const id = req.params.id;
  console.log(id);
  // console.log(JSON.stringify(req.params.wineId));
  db
    .one("SELECT * FROM wine_product WHERE id = ${id}", { id: id })
    .then(data => {
      res.locals.wineIdData = data;
      console.log(res.locals.wineIdData);
      next();
    })
    .catch(error => {
      console.log("Error: in winesMdl.findById. Details: ", error);
      next(error);
    });
};

///////////////////////////////////////////////////////
//     Create new record in wine_product DB          //
///////////////////////////////////////////////////////

// First, display form using GET...
winesMdl.create_get = (req, res, next) => {
  console.log(JSON.stringify(req.body));
  next();
};

// Then, create new a record using POST...
winesMdl.create_post = (req, res, next) => {
          // eno_user_id,
        // region_id,
        // producer_id,
  db
    .one(
      "INSERT INTO wine_product (prdct_name, category, style, origin, package, released_on, description, tasting_note, image_thumb_url, image_url, varietal, sugar_grm_ltr, reg_price_cc, alcohol_cntnt, sugar_cntnt, producer_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING id;",
      [
        req.body.name,
        req.body.seondary_category,
        req.body.style,
        req.body.origin,
        req.body.package,
        req.body.released_on,
        req.body.description,
        req.body.tasting_note,
        req.body.image_thumb_url,
        req.body.image_url,
        req.body.varietal,
        req.body.sugar_in_grams_per_liter,
        req.body.regular_price_in_cents,
        req.body.alcohol_content,
        req.body.sugar_content,
        req.body.producer_name
        
      ]
    )
    .then(data => {
      res.locals.newWineId = data.id;
      console.log(res.locals.newWineId);
      // Not defined!
      // alert(`Record saved, id: ${res.locals.newWineId}`)
      // sic!
      next();
    })
    .catch(error => {
      console.log("Error: in winesMdl.create_post. Details: ", error);
      next(error);
    });
};

///////////////////////////////////////////////////////
//  Modify single record in wine_product DB          //
//  need id from "wine_product" table coming         //
//  from /wines/:wineId PUT...                       //
///////////////////////////////////////////////////////
winesMdl.update = (req, res, next) => {
  console.log("Record :id = ", req.params.id)
  const id = Number(req.params.id);
  // req.body.eno_user_id,
        // req.body.region_id,
        // req.body.producer_id,
  db
    .one(
      "UPDATE wine_product SET producer_name = $1, prdct_name = $2, category = $3, style = $4, origin = $5, package = $6, released_on = $7, description = $8, tasting_note = $9, image_thumb_url = $10, image_url = $11, varietal = $12, sugar_grm_ltr = $13, sugar_cntnt = $14, alcohol_cntnt = $15, reg_price_cc = $16 WHERE id = $17 RETURNING * ;",
      [
        req.body.producer_name,
        req.body.prdct_name,
        req.body.category,
        req.body.style,
        req.body.origin,
        req.body.package,
        req.body.released_on,
        req.body.description,
        req.body.tasting_note,
        req.body.image_thumb_url,
        req.body.image_url,
        req.body.varietal,
        req.body.sugar_grm_ltr,
        req.body.sugar_cntnt,
        req.body.alcohol_cntnt,
        req.body.reg_price_cc,
        id
        
      ]
    )
    .then(data => {
      res.locals.updatedWineData = data;
      next();
    })
    .catch(error => {
      console.log("Error: in winesMdl.update. Details: ", error);
      next(error);
    });
};

///////////////////////////////////////////////////////
//          Delete single record from DB             //
///////////////////////////////////////////////////////
winesMdl.destroy = (req, res, next) => {
  console.log("In destroy with req.params.id: ", req.params.id);
  db
    .none("DELETE FROM wine_product WHERE id = $1", [req.params.id])
    .then(() => {
      next();
    })
    .catch(error => {
      console.log("Error: in winesMdl.destroy. Details: ", error);
      next(error);
    });
};





////////////////////////////////////////////////////
//                                                //
//  Functions below this line provide a           // 
//  functionality that is not part of MVP...      //
//  That is, handling model user_wine_comments    //
//                                                //
////////////////////////////////////////////////////

////////////////////////////////////////////////////
// From T.Gardner example... #1                   //
////////////////////////////////////////////////////

////////////////////////////////////////////////////
//     findByUser  in user_wine_comments          //
////////////////////////////////////////////////////

userWinesMdl.findByUser = (req, res, next) => {
  console.log("in winesMdl.findByUser, req.user: ", req.user);
  db
    .manyOrNone("SELECT * FROM user_wine_comments WHERE eno_user_id = $1;", [req.user.id])
    .then(result => {
      res.locals.userWineData = result;
      next();
    })
    .catch(err => {
      console.log("Error: in uesrWinesMdl.findByUser. Details: ", err);
      next(err);
    });
};

////////////////////////////////////////////////////
//   End of it...   findByUser                    //
////////////////////////////////////////////////////

////////////////////////////////////////////////////
// From T.Gardner example... #2                   //
////////////////////////////////////////////////////

// this is used in the 'wines/:wineName' route in
// controllers/wines.js...
// Once found in the "wine_product" table - show
// the record by current user in the 
// "user_wine_comments" 

////////////////////////////////////////////////////
// This should be a query to DB, not to API...    //
// Looks like it supposed to be a two steps       //
// or outer join request...                       //
////////////////////////////////////////////////////
userWinesMdl.findByName = (req, res, next) => {
  // .wineId is provided by HTML route...
  const id = req.params.wineId;
  console.log(id);
  console.log(JSON.stringify(req.params.wineId));

  // const wineName = req.params.wineName;
  // axios({
  //   url: `http://www.mtastat.us/api/trains/${wineName}`,    // do not forget to change...
  //   method: "get"
  // })

  db
    .one("SELECT * FROM user_wine_comments WHERE wine_prod_id = ${id}", { id: id })
    .then(data => {
      res.locals.wineData = response.data;
      next();
    })
    .catch(err => {
      console.log("Error: in userWinesMdl.getByName. Details: ", err);
      next(err);
    });
};

////////////////////////////////////////////////////
//   End of it...   findByName                    //
////////////////////////////////////////////////////

////////////////////////////////////////////////////
// From T.Gardner example... #3                   //
////////////////////////////////////////////////////

// used in the '/users/wines/:wineName/edit' GET
// method in controllers/users.js
userWinesMdl.findByUserAndName = (req, res, next) => {
  const wineId = req.params.wineName; // actually, this is supposed to be an id...
  const userId = req.user.id;

  db
    .one("SELECT * FROM user_wine_comments WHERE eno_user_id = $1 AND wine_prod_id = $2", [
      userId,
      wineId
    ])
    .then(result => {
      res.locals.wineData = result;
      next();
    })
    .catch(err => {
      console.log(
        "Error: in userWinesMdl.findByUserAndName. Details: ",
        err
      );
      next(err);
    });
};

////////////////////////////////////////////////////
//   End of it...   findByUserAndName             //
////////////////////////////////////////////////////

////////////////////////////////////////////////////
// From T.Gardner example... #4                   //
////////////////////////////////////////////////////

// This is used in the 'users/wines' POST route in controllers/users.js
userWinesMdl.addUserWine = (req, res, next) => {
  console.log("----------------------");
  console.log("In userWinesMdl.addUserWine. req.body: ", req.body);

  // Where this comes from?..
  const userId = req.user.id;
  // These come from HTML form...
  const wineId = req.body.wineId;
  const comment = req.body.comment;
  const url = req.body.url;

  db
    .one(
      "INSERT INTO user_wine_comments (eno_user_id, wine_prod_id, note, img_note_url) VALUES ($1, $2, $3, $4) RETURNING id;",
      [userId, wineId, comment, url]
    )
    .then(result => {
      res.locals.wineComId = result.id;
      next();
    })
    .catch(err => {
      console.log("Error: in userWinesMdl.addUserWine. Details: ", err);
      next(err);
    });
};

////////////////////////////////////////////////////
//   End of it...   addUserArtcl.                 //
////////////////////////////////////////////////////

////////////////////////////////////////////////////
// From T.Gardner example... #5                   //
////////////////////////////////////////////////////

// this gets used in the '/users/artcls/:artclName'
// PUT method in controllers/users.js...

userWinesMdl.updateWine = (req, res, next) => {
  console.log("------------------------");
  console.log("In userWinesMdl.updateWine. req.body: ", req.body);

  const userId = req.user.id; // DB: eno_user_id...
  // We get the wineName (id) from a different place
  // than addUserWine in this method...

  const wineId = req.params.wineId;      // DB: wine_prod_id...
  const comment = req.body.comment;      // DB: note...
  const url = req.body.url;              // DB: img_note_url...

  db
    .one(
      "UPDATE user_wine_comments SET note = $1, img_note_url = $2 WHERE eno_user_id = $3 AND wine_prod_id = $4 RETURNING id;",
      [comment, url, userId, wineId ]
    )
    .then(data => {
      res.locals.edtdWineId = data.id;
      next();
    })
    .catch(err => {
      console.log("Error: in userWinesMdl.updateWine. Details: ", err);
      next(err);
    });
};

////////////////////////////////////////////////////
//   End of it...   updateArtcl.                  //
////////////////////////////////////////////////////

////////////////////////////////////////////////////
// From T.Gardner example... #6                   //
////////////////////////////////////////////////////

userWinesMdl.destroy = (req, res, next) => {
  console.log("--------------------------");
  console.log("In userWinesMdl.destroy.");

  const userId = req.user.id;
  const wineId = req.params.wineId;

  db
    .none("DELETE FROM user_wine_comments WHERE eno_user_id = $1 AND wine_prod_id = $2", [
      userId,
      wineId
    ])
    .then(() => {
      next();
    })
    .catch(err => {
      console.log("Error: in userWinesMdl.destroy. Details: ", err);
      next(err);
    });
};

////////////////////////////////////////////////////
//   End of it...   destroy.                      //
////////////////////////////////////////////////////



module.exports = winesMdl;
// module.exports = { winesMdl, userWinesMdl }; // Looks like this did not work...
