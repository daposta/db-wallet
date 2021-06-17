const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const utils = require('../lib/utils');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const passport = require('passport');
const checkAuth = require('../lib/check-auth');


router.get('/', (req, res) =>{
  res.send('index');
});

//login route
router.post('/login', (req, res) =>{
  const { email, password} = req.body;

  let errors =[]

  //check required fieds
  if(!email || !password){
    
    res.send({msg: 'Please fill required fields'});
  }
  else{
    User.findOne({email: email}).then(user =>{
      if (!user){
         res.send({msg: 'Email is not found'});
      }
      //match password
      bcrypt.compare(password, user.password, (err, isMatch) =>{
        if(err) throw err
        if(isMatch){
          const _jwt = utils.issueJWToken(user);
          res.send({msg: 'Login successful', user: user, token:_jwt.token , expires_in: _jwt.expires})
        }else{
          res.send({msg: 'No user with credentials'});
        }
      })


    })
    .catch(err => res.send(err))

  }
});

//register route
router.post('/register', (req, res) =>{
  const {name, email, password} = req.body;

  let errors =[]

  //check required fieds
  if(!email || !name || !password){
    errors.push({msg: 'Please fill required fields'});
  }

  //check password length
  if(password.length < 6){
    errors.push({msg: 'Password should be at least 6 characters'});
  }

  if(errors.length > 0){
    res.send(errors);
  }else{
       //check if user exists
      User.findOne({email: email}).then(user =>{
          //user exists
          if(user){
             errors.push({msg: 'User with email already registered'});
            res.send(errors);

          }else{
            const newUser = new User({name, email, password});

             bcrypt.genSalt(10, (err, salt)=> {
              bcrypt.hash(newUser.password, salt , (err, hash)=> {
                if(err)  throw err

                newUser.password = hash;
                newUser.save().then(user => {
                  //create wallet for user
                  const newWallet = new Wallet({owner: newUser});
                  newWallet.save();
                  const _jwt = utils.issueJWToken(user);
                  res.send({msg: 'User saved', user: user, token:_jwt.token , expires_in: _jwt.expires})
                })
                .catch(err => res.send(err))

              })
            });
          }
         
        })  
      

    }

  
});




//debit route
router.post('/debit', checkAuth, (req, res, next) =>{
   //res.send('debit route');
   
   if(!req.body.amount){
    return res.send({msg: "Enter amount to be debited"});
    
   }

    Wallet.findOne({owner : req.userData})
    .then(_wallet => {
      console.log(_wallet.available_balance);
      if(req.body.amount >  _wallet.available_balance){
         return  res.send({msg: "You do not have sufficient balance"});
      }
      else{
        _wallet.available_balance = _wallet.available_balance - req.body.amount
         _wallet.total_balance = _wallet.total_balance - req.body.amount
          _wallet.ledger_balance = _wallet.ledger_balance - req.body.amount
        _wallet.save().then(savedDoc => {
          return res.send({msg: `Account debited successfully. You now have a balance of ${ _wallet.available_balance}`}) // true
        });
      }
    })
    .catch(err => res.send(err))
   
});




//debit route
router.post('/credit', checkAuth, (req, res, next) =>{
   //res.send('debit route');
  
  

   if(!req.body.amount){
    return res.send({msg: "Enter amount to be credited"});
    
   }
    Wallet.findOne({owner : req.userData})
    .then(_wallet => {
    
     
        _wallet.available_balance = _wallet.available_balance + req.body.amount
         _wallet.total_balance = _wallet.total_balance + req.body.amount
          _wallet.ledger_balance = _wallet.ledger_balance + req.body.amount
        _wallet.save().then(savedDoc => {
          return res.send({msg:  `Account credit successfully. You now have a balance of ${_wallet.available_balance} `}) // true
        });
      
    })
    .catch(err => res.send(err))
   
});


module.exports = router;