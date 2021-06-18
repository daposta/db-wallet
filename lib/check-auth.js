const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = (req, res, next) => {
    if (req.headers && req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      console.log(token);
      try{
        const decoded = jwt.verify(token, 'tasmanianDevil');  
        console.log('decoded....', decoded);
        User.findOne({_id: decoded.sub}).then(user =>{
                // Do something with the user
                 req.userData = user;
                next();
            });
      }
      catch (e) {
              return res.status(401).send('Invalid token');
          }
      
    
     
  }else{
    return res.send(500);
  }
  //
}