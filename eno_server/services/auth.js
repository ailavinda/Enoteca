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
// Belongs to eno_server/services directory... //
//                                             //
/////////////////////////////////////////////////

// This style of authenticatione will be 
// substituded later...

// Passport is Express-compatible authentication 
// middleware for node.js... This is done through an 
// extensible set of plugins known as strategies...

// Passport will maintain persistent login sessions...
const passport = require('passport');

// We're going to need the User model...
const User = require('../models/users');
// And we're going to need the Local Strategy for
// this kind of registration...

// (There are 300+ strategies...)
const LocalStrategy = require('passport-local').Strategy;

// We'll also need bcrypt to authenticate users without
// storing their passoword _anywhere_...
const bcrypt = require('bcryptjs');


const authObject = {};

authObject.passportInstance = passport.initialize();
authObject.passportSession = passport.session();

authObject.restrict = function restrict(req, res, next) {
    console.log('In auth.restrict. req.isAuthenticated(): ', req.isAuthenticated());
    if (req.isAuthenticated()) {
        next();
    } else if (req.method === 'POST') {
        res.send('logged out...');
    } else {
        res.redirect('/users/login');
    }
}

// Given user information called "user", what do we
// want to serialize to the session? This information
// will be stored client-side in an encoded form.
// We can then retrieve that information during the
// next request phase in req.deserializeUser...
// Here we're not actually doing anything beyond
// storing the normal user data, however...
passport.serializeUser((user, done) => {
    console.log('In passport.serializeUser. user: ', user);
    done(null, user);
});

// Given an object representing our user (obtained
// from the session), how shall we define any other
// user information we'll need in our routes, 
// conveniently accessible as req.user in routes?
passport.deserializeUser((userObj, done) => {
    console.log('In passport.deserializeUser. userObj: ', userObj);
    User
        .findByEmail(userObj.email) 
        .then(user => {
            // Updates us to current database values...
            done(null, user); 
        })
        .catch(err => {
            console.log('ERROR in deserializeUser: ', err);
            done(null, false);
        });
});

// See router.post('/', ...) in controllers/users...
passport.use(
    'local-signup',
    new LocalStrategy({
            // These are the names of the fields for
            // email and password in the login form
            // we'll be serving (see the view)...
            usernameField: 'user[email]',
            passwordField: 'user[password]',
            passReqToCallback: true
        },

        // Note the `done` parameter:
        (req, email, password, done) => {
            // User.create returns a promise we can chain onto...
            User
                .create(req.body.user) 
                .then((user) => {
                    // Signals that we have successfully signed up.
                    // The second argument will get further
                    // processed by passport.serializeUser...
                    return done(null, user); 
                })
                .catch((err) => {
                    console.log('ERROR:', err);
                    // Signals that signup was unsuccessful...
                    return done(null, false); 
                });
        })
);

passport.use(
    'local-login',
    new LocalStrategy({
            usernameField: 'user[email]',
            passwordField: 'user[password]',
            passReqToCallback: true
        },
        (req, email, password, done) => {
            // Returns a promise!..
            User
                .findByEmail(email) 
                .then((user) => {
                    if (user) {
                        // Here we use bcrypt to figure out 
                        // whether the user is logged in or
                        // not
                        // bcrypt.compareSync re-hashes the 
                        // password and sees if it matches 
                        // user.password_digest,
                        // returning true if there's a match
                        // and false otherwise...
                        const isAuthed = bcrypt.compareSync(password, user.password_digest);
                        console.log('is Authenticated: ', isAuthed);
                        if (isAuthed) {
                            // Signals that we're logged in.
                            // The second argument will get
                            // further processed by 
                            // passport.serializeUser...
                            return done(null, user); 
                        } else {
                            // Signals we aren't logged in...
                            // ...no matching digest in DB...
                            return done(null, false); 
                        }
                    } else {
                        // Sgnals we aren't logged in 
                        // user was not found in DB by email...
                        return done(null, false); 
                    }
                });
        })
);

// Export this stuff, hook up in the top index.js...
module.exports = authObject; 
//{ passportInstance, passportSession, restrict };



