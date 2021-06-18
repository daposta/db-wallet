const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  timestamps: {} ,
  name: {type: String, required:true},
  email: {type: String, required:true},
  password: {type: String, required:true,  },
  
});

module.exports = mongoose.models.user || mongoose.model("user", UserSchema) ;