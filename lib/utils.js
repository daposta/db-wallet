const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
// const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

// console.log('PUB_KEY...', PRIV_KEY)

/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property to the MongoDB user ID
 */


function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];

  if (bearerHeader) {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}
function issueJWToken(user) {
 
  const _id = user._id;

  const expiresIn = '1d';

  const payload = {
    sub: _id,
    iat: Date.now()
  };
  
  const signedToken = jsonwebtoken.sign(payload, 'tasmanianDevil');
  
  
  return {
    token: "Bearer " + signedToken,
    expires: expiresIn
  }
}


module.exports.issueJWToken = issueJWToken;
module.exports.verifyToken = verifyToken;

