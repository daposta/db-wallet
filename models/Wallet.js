const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WalletSchema = new mongoose.Schema({
  //timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  // createdAt: {type: Date, default: Date.now},
  // updatedAt: {type: Date, default: Date.now,},
   timestamps: {} ,
  total_balance: {type: Number, required: true, default:0 },
  ledger_balance: {type: Number, required: true, default:0 },
  available_balance: {type: Number, required: true, default:0 },
  owner:[
      {type: Schema.Types.ObjectId, ref: 'user'}
    ]
});





module.exports = mongoose.model('wallet', WalletSchema)