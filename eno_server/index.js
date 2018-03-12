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
// File belongs to eno_server directory...     //
//                                             //
/////////////////////////////////////////////////

///////////////////////////////////////////////////////////////
//                                                           //
// Setup: index.js - main file in the Enotica server.        //
//                                                           //
///////////////////////////////////////////////////////////////

// Import dependencies...
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

// Cross-origin resource sharing (CORS) allows AJAX requests
// to skip the Same-origin policy and access resources from
// remote hosts...
// The Access-Control-Allow-Origin header determines which 
// origins are allowed to access server resources over CORS 
// (the * wildcard allows access from any origin)...
// https://medium.com/trisfera/using-cors-in-express-cac7e29b005b
const cors = require('cors');

//////////////////////////////////////////////////////////////
//                                                          //
//  AUTH: authService and tokenService - to implement later //
//                                                          //
//////////////////////////////////////////////////////////////
// Authentication for React Router environment...
// const tokenService = require('./services/TokenService');
// const authService = require('./services/AuthService');
// ...commented out until later...
//////////////////////////////////////////////////////////////
// AUTH: see more lines of this below...                    //
//////////////////////////////////////////////////////////////

// express authentication environment...
// ...HTTP Sessions rely on cookies, which are not sent by 
// default over CORS...
const session = require('express-session');
const cookieParser = require('cookie-parser');
// Comment above lines out if different auth style used...

///////////////////////////////////////////////////////////////
//                                                           //
//     Need a .env file (recommend be ignored from your      //
//     git/mercurial/etc):                                   //
//     FOO=bar                                               //
//     BAZ=bob                                               //
//     Then in app entry file (index.js) put the line in     //
//     as early as possible:                                 //
//                                                           //
//     require('dotenv').config();                           //
//                                                           //
//     'process.env' will now contain the                    //
//     variables above:                                      //
//                                                           //
//     console.log(process.env.FOO);                         //
//     bar                                                   //
//     The '.env' file isn't required so you don't need to   // 
//     worry about your app falling over in it's absence.    //
//                                                           //
// https://stackoverflow.com/questions/22312671/node-js-setting-environment-variables
//                                                           //
///////////////////////////////////////////////////////////////

const dotenv = require('dotenv').config();

// PORT is for web deployment only.
// 3000 is a local port...
const PORT = process.env.PORT || 3000;

console.log('process.env.API_KEY: ', process.env.API_KEY);
console.log('process.env.PORT: ', process.env.PORT);

// Configure app...
const app = express();

// Setup cors to allow front-end...
app.use(cors());

// ...to enable HTTP cookies over CORS... see above...
// app.use(cors({
//   credentials: true,
// }));
// ... and later, use with AJAX calls:
// xhr.withCredentials = true;

const mustacheExpress = require('mustache-express');

// Register the template engine for use in res.render...
app.engine('html', mustacheExpress());

// Set the file extension to use for views when the file
// extension is omitted...
app.set('view engine', 'html');

// Set the the directory that will contain our mustache
// template files, or "views"...
app.set('views', __dirname + '/views');

// Set the directory that will contain our static 
// (not generated on the fly) resources, such as css,
// client-side JavaScript files, and images...
app.use(express.static(__dirname + '/public'));

//////////////////////////////////////////////////////////////
//          Set up SESSION middleware...                    //
//////////////////////////////////////////////////////////////
//  ool-ad0200c8:models ailavinda$ env                      //
//          HOME=/Users/ailavinda                           //
//          LOGNAME=ailavinda                               //
//          SECURITYSESSIONID=186a7                         //
//          _=/usr/bin/env                                  //
//////////////////////////////////////////////////////////////

app.use(session({
    secret: process.env.SECRET_KEY,
    // secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

//////////////////////////////////////////////////////////////
//                                                          // 
// PASSPORT STUFF: const passport = require('passport');    //
//                                                          //
//////////////////////////////////////////////////////////////
const auth = require('./services/auth.js');
app.use(auth.passportInstance);
app.use(auth.passportSession);

//////////////////////////////////////////////////////////////
// END OF PASSPORT STUFF...                                 //
//////////////////////////////////////////////////////////////


// morgan setup...
app.use(morgan('dev'));

// body-parser setup...
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());

//////////////////////////////////////////////////////////////
//                                                          //
//  AUTH: authService and tokenService - to implement later //
//                                                          //
//////////////////////////////////////////////////////////////
// this will parse the incoming token as a middleware...
// app.use(tokenService.receiveToken);
// ...comment out cookieParser() above...
//////////////////////////////////////////////////////////////
// AUTH: see more lines of this below...                    //
//////////////////////////////////////////////////////////////

// Start server...
app.listen(PORT, () => { 
  console.log("Server started on " + PORT); 
});

//////////////////////////////////////////////////////////////
//      Setting Up Routers...                               //
//////////////////////////////////////////////////////////////
//      Default "roots": /users,                            //
//                       /wines,                            //
//////////////////////////////////////////////////////////////

// Set up the users controller...
const usersRouter = require('./controllers/users.js');
// Hook it up to the app...
app.use('/users', usersRouter);

// Set up the wines controller... 
const fndWineRouter =require('./controllers/wines.js');
// Hook it up to the app...
app.use('/wines', fndWineRouter);


// Redirect from the current index.js...
// "/users/profile" is not relative, but 
// hard-coded...
app.get('/', (req, res, next) => {
  res.redirect('/users/profile');
})
// Comment the above out if authService is in use...

//////////////////////////////////////////////////////////////
//                                                          //
//  AUTH: authService and tokenService - to implement later //
//                                                          //
//////////////////////////////////////////////////////////////
// authService.restrict is used as a middleware for 
// restricted routes...
// app.get('/restricted', authService.restrict(), (req, res) => {
//   res.json({ msg: 'yay' });
// });

// app.get('/isLoggedIn', authService.isLoggedIn, (req, res) => {
//   res.json({ isLoggedIn: res.locals.isLoggedIn, tokenData: res.locals.tokenData });
// });
// Commenting avove lines out until later...
//////////////////////////////////////////////////////////////
// AUTH: the END of...                                      //
//////////////////////////////////////////////////////////////


// Set up an error handling middleware;
// This is the LAST thing we do)...
app.use((err, req, res, next) => {
  console.log('Error: in app index.js. Details: ', err);
  // ...the next line throws an error JSON converting of "anonymous"...
  // res.status(err.status || 500);
  // Still getting same error, code 400...
  res.status(500);
  res.send(err);
});
