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

const User = require('../models/users');
const router = require('express').Router();
const passport = require('passport');

// Wines model...
const winesMdl = require('../models/wines');

// express - session - passport authentication...
const auth = require('../services/auth');

// This has been done in the application's
// index.js as well: app.get('/',..)... 
router.get('/', (req, res, next) => {
    res.redirect('users/profile');
    // what's up with the leading slash?..
});

router.post(
    '/',
    // We want the behavior of the site to vary
    // depending on whether or not the user is
    // already logged in. If they are logged in,
    // we want to send them to /users/profile.
    // If they are not, we want to send them to
    // users/new.
    passport.authenticate(
        // The following string indicates the
        // particular strategy instance we'll
        // want to use to handle signup. We
        // defined behavior for 'local-signup'
        // back in the app's index.js...
        'local-signup', {
            failureRedirect: '/users/new',
            successRedirect: '/users/profile'
        }
    )
);

/////////////////////////////////////////////
//       Register new user...              //
/////////////////////////////////////////////

router.get('/new', (req, res) => {
    res.render('users/new');
    // here leading slash is missing...
});

/////////////////////////////////////////////
//       User logout...                    //
/////////////////////////////////////////////

router.get('/logout', (req, res) => {
    // Passport put this method on req for
    // us...
    req.logout();
    // Redirect back to index page...
    res.redirect('/');
    // ...which in turn redirects to (see above)
    // /users/profile...
});

/////////////////////////////////////////////
//       User login...                     //
/////////////////////////////////////////////

router.get('/login', (req, res) => {
    res.render('users/login');
    // Same - no slash in front of users...
});

// passport.authenticate will _build_ 
// middleware for us based on the 
// 'local-login' strategy we had registered
// with passport in the services/auth.js...
router.post(
    '/login', 
    passport.authenticate('local-login', {
        failureRedirect: '/users/login',
        successRedirect: '/users/profile'
        // No differences regarding slashes...
    })
);


/////////////////////////////////////////////
//       User profile...                   //
/////////////////////////////////////////////

router.get(
    '/profile',
    // Middleware (that we wrote) ensuring
    // that if the user is not authenticated,
    // he or she will be redirected to the
    // login screen...
    auth.restrict,     // On Mar 13 at 22:13...
    User.findByEmailMiddleware,
    (req, res) => {
        console.log('In handler for users/profile ');
        console.log('req.user: ');
        console.log(JSON.stringify(req.user));
        console.log('res.local.userData: ' + JSON.stringify(res.locals.userData));
        res.render('users/profile', { email: res.locals.userData.email });
        
        // 'counter' functionality has been removed...                             
        // res.render('users/profile', { email: res.locals.userData.email,
        //                               counter: res.locals.userData.counter
        //                               // I have changed this to be able 
        //                               // populating the html using mustache...
        //  });
    }
);


// 'counter' functionality has been removed...

// router.post(
//     '/counter',
//     auth.restrict,
//     User.incrementUserCounter,
//     (req, res) => {
//         console.log('In post at /counter, req.user: ', JSON.stringify(req.user));
//         console.log('In post at /counter, req.user.email: ', JSON.stringify(req.user.email));
//         console.log('In post at /counter, res.locals.counterData: ', JSON.stringify(res.locals.counterData));
//         // res.json(res.locals.counterData);
//         res.render('users/profile', { email: req.user.email,
//             counter: res.locals.counterData.counter });
//         // Once again - deviated from T.Gardner
//         // To have better handling of html + mustache...
//     }
// );


module.exports = router;
