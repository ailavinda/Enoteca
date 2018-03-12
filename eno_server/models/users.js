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

// bcryptjs incorporates salt to protect against
// 'rainbow table' attacks - precomputed table 
// for reversing cryptographic hash functions...
// the module makes itself slower to remain 
// resistant to brute-force search attacks while
// computational power increasing...
// Max input is 72 bytes, generated hashes are 
// 60 char...
// On node.js the built-in crypto module's 
// randomBytes interface is used for secure
// random numbers...

const bcrypt = require('bcryptjs');

// Encoded password (digest = sulted hash of the password)
// is saved in our database...
const db = require('../db/index.js');

const userModelObject = {};

// Note that this is NOT a middleware!..
userModelObject.create = function create(user) {
    // This is where we obtain the hash of the user's password.
    const passwordDigest = bcrypt.hashSync(user.password, 10);

    // Generally we try to avoid passing promises around, but here 
    // LocalStrategy's interface means we can't just rely on next() 
    // to glide us to the next thing we want to do. So we'll 
    // return the callback...
    // To see how it's used, look into passport.use('local-strategy',
    // ...) in services/auth.js...

    // Here we make an entry in the database for the new
    // user. 
    //
    // Removing the counter...
    // We set the counter to 0 initially.
    //
    // We do NOT store the password in the database!
    // Instead we store the password digest, which is a salted
    // hash of the password.
    // If someone grabs the password digest it won't tell them
    // what the password is,
    // but we can use the password digest to verify if a 
    // submitted password is correct.
    // This is the magic of hashes...
    return db.oneOrNone(
        'INSERT INTO eno_user (email, password_digest) VALUES ($1, $2) RETURNING *;', [user.email, passwordDigest] 
    );
    // Removed the counter...
    // 'INSERT INTO users (email, password_digest, counter) VALUES ($1, $2, $3) RETURNING *;', [user.email, passwordDigest, 0]
};

// THE tricky part.
// We need both a middleware AND a NON-middleware version 
// (non-middleware for use in services/auth.js)...

// Again, LocalStrategy's interface means it's easiest to
// return a promise here...
userModelObject.findByEmail = function findByEmail(email) {
    return db.oneOrNone('SELECT * FROM eno_user WHERE email = $1;', [email]);
};

userModelObject.findByEmailMiddleware = function findByEmailMiddleware(req, res, next) {
    console.log('In findByEmailMiddleware...');
    const email = req.user.email;
    // Here we're using the NON-middleware version above,
    // getting back a promise...
    userModelObject
        .findByEmail(email) 
        .then((userData) => {
            res.locals.userData = userData;
            next();
        }).catch(err => console.log('ERROR: in userModelObject.findByEmail. Details: ', err));
};

///////////////////////////////////////////////////////////
//  Insert normal model functionality for "users" here.  //
///////////////////////////////////////////////////////////

//
// Removed the counter...
//
// This section just demonstrates that we can build middleware
// for the user model and talk to the database as usual... 
// Note that we now have access to req.user for user information,
// thanks to passport...
// userModelObject.incrementUserCounter = function incrementUserCounter(req, res, next) {
//     // Update and return the user counter number...
//     db.one(
//         'UPDATE eno_user SET counter = counter + 1 WHERE email = $1 RETURNING counter', [req.user.email]
//     ).then((counterData) => {
//         res.locals.counterData = counterData;
//         console.log(res.locals.counterData);
//         next();
//     }).catch(err => console.log('ERROR:', err));
// };

///////////////////////////////////////////////////////////
// End of normal model functionality for "users".        //
///////////////////////////////////////////////////////////

module.exports = userModelObject;

