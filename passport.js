
const express = require('express');

const jwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;
const User = require('./models/user');

const fs = require('fs');
const path = require('path');
const passport = require('passport');

// const pathToKey = path.join(__dirname, '.', 'id_rsa_pub.pem');
// const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');


const options = {
  jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),//.fromAuthHeaderWithScheme('jwt'),//fromAuthHeaderAsBearerToken(),
  secretOrKey: 'tasmanianDevil' ,//PUB_KEY,
  //algorithms: ["HS256"]
  passReqToCallback: true
};





module.exports = (passport) => {
    // The JWT payload is passed into the verify callback
    passport.use(new jwtStrategy(options, function(req, jwt_payload, done) {

        
        // We will assign the `sub` property on the JWT to the database ID of user
        User.findOne({_id: jwt_payload.sub}, function(err, user) {
            
            // This flow look familiar?  It is the same as when we implemented
            // the `passport-local` strategy
            console.log('zooom');
            console.log(jwt_payload.body);
            console.log(req.body);
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user, req);
            } else {
                return done(null, false);
            }
            
        });
        
    }));
}

