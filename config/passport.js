const express = require('express');

const jwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;
const User = require('./models/user');

const fs = require('fs');

const PUB_KEY = fs.readFileSync(__dirname + '/id_rsa_pub.pem', 'utf8');
// const PRIV_KEY = fs.readFileSync(__dirname + '/id_rsa_priv.pem', 'utf8');

const options = {
  jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ["HS256"]
};

// const strategy = new jwtStrategy(options, (jwt_payload, done) => {
//     console.log('-0-----');
//     console.log(jwt_payload); 
//     User.findOne({id: jwt_payload.payload._id}, function(err, user) {
//         if (err) {
//             return done(err, false);
//         }
//         if (user) {
//             return done(null, user);
//         } else {
//             return done(null, false);
//             // or you could create a new account
//         }
//     });
// });



// module.exports = (passport) =>{
//   console.log('calling strategy....'+ passport );
//   passport.use(strategy);
// };


passport.use(new JwtStrategy(options, function(jwt_payload, done) {
    console.log(`payload... ${jwt_payload}`);
    // We will assign the `sub` property on the JWT to the database ID of user
    User.findOne({id: jwt_payload.sub}, function(err, user) {
        
        // This flow look familiar?  It is the same as when we implemented
        // the `passport-local` strategy
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
        
    });
    
}));