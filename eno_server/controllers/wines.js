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
// Belongs to eno_server/controllers directory.//
//                                             //
/////////////////////////////////////////////////

const router = require("express").Router();
const winesMdl = require("../models/wines.js");
// const userWinesMdl = require("../models/wines.js");

const auth = require("../services/auth");

router.get('/', (res, req, next) => {
    req.redirect('/wines/search');
});

///////////////////////////////////////////////////////////
//                                                       //
//  LCBO API search the records for user to save in DB   //
//                                                       //
///////////////////////////////////////////////////////////

// If the API has a massive number of items
// in it, and if it uses a serach feature for
// particular elements, for example...
// To show how to do that, we're going to
// set up a system where we render
// a page with an empty list which we then
// populate dynamically client-side
// with calls back to the server...
router.get(
    '/search', 
    // ...this is in fact /wines/search...
    // auth.restrict, 
    winesMdl.allWines, (req, res, next) => {
    console.log('In GET /search router (= /wines/search), controllers/wines.js: ');
    // This router will use axios several times to
    // access API, and then would seed the DB...
    res.render('winesSearch');
});

///////////////////////////////////////////////////////////
//                                                       //
// .allWines is not for insertion of new records into DB!//   
//                                                       //
// What is needed is to display the result of search and //
// allow user to save one by one into DB...              //
router.post(
    '/', 
    // auth.restrict, 
    winesMdl.allWines, (req, res, next) => {
    console.log('In POST /search router (= /wines/search), controllers/wines.js');
    res.render('winesAPI');
});
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
//                                                       //
//  The END of LCBO API search...                        //
//                                                       //
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
//                                                       //
//  CRUD functionality for "wine_product" DB table       //
//                                                       //
///////////////////////////////////////////////////////////

// Just fetching everything from DB...
router.get(
    '/searchDB',
    // auth.restrict, 
    winesMdl.allDBwines, (req, res, next) => {
    console.log('In GET /searchDB router (= /wines/searchDB), controllers/wines.js');
    
    res.render('winesDB');
});

// Show single wine from DB by id...
router.get(
    '/:id', 
    winesMdl.findById, (req, res, next) => {
        console.log('In GET /:wineId router (= /wines/:wineId), controllers/wines.js');
        console.log(JSON.stringify(res.locals.wineIdData));
    res.render("showWineDB", res.locals.wineIdData);
});

// This is according to MDN, which recommends
// serving "create" by "get", and then 
// submitting the form by "post":
// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes

router.get(
    '/create', 
    winesMdl.create_get, (req, res, next) => {
    // res.send(`In the GET for create new...${req.params.wineId}`)
    // res.render('create', res.locals.newWineId);
    res.render('create');
});

router.post(
    '/create', 
    winesMdl.create_post, (req, res, next) => {
    // res.send(req.params.wineId);

    // If user is in API search and marked a record for
    // saving to DB we want them to remain on the same 
    // page without refreshing, and be able to save again...
    // Some "alert" action with returned record id?
    // On the other hand, if DB is populated manually, the
    // usual action would be refresh the page with all the
    // wines from DB to show new addition...

    // Not defined!
    // alert(`Record saved, id: \n ${res.locals.newWineId}`);
    // sic!

    // res.render('wines', res.locals.newWineId);
    res.redirect('/wines/searchDB');
    // res.json has been tested and worked okay:
    
});

// Update DB record by id...
router.put(
    '/:id', 
    // auth.restrict, 
    winesMdl.update, (req, res, next) => {
        console.log("In PUT for /wines/:id... controllers/wines.js")
        // res.json(res.locals.updatedWineData);
        console.log("After update: ", res.locals.updatedWineData);
        res.redirect('/wines/'+res.locals.updatedWineData.id);
});

// Destroy DB record by id...
router.delete(
    '/:id',
    // auth.restrict,  
    winesMdl.destroy, (req, res, next) => {
    // res.json({ id: req.params.id }); 
    res.redirect('/wines/searchDB');
});


///////////////////////////////////////////////////////////
//                                                       //
//  The END of CRUD for "wine_product" DB table...       //
//                                                       //
///////////////////////////////////////////////////////////



// Commenting below for now, as it cleary
// shoud be in the user_wine_comments model,
// "GET" by name in /wines/:wineName...

// router.get(
//     '/:wineName',
//     // auth.restrict, 
//     winesMdl.findByName, (req, res, next) => {
//     console.log('In GET at /wines/:wineName, res.locals.wineData: ', res.locals.wineData);
//     res.render('wines', res.locals.wineData);
// });


module.exports = router;