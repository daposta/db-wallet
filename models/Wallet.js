const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WalletSchema = new mongoose.Schema({
  total_balance: {type: Number, required: true, default:0 },
  ledger_balance: {type: Number, required: true, default:0 },
  available_balance: {type: Number, required: true, default:0 },
  owner:[
      {type: Schema.Types.ObjectId, ref: 'user'}
    ]
});





module.exports = mongoose.model('wallet', WalletSchema)