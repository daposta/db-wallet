const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(require('./routes'));

require('./passport')(passport);

app.use(cors());

// app.use(bodyParser.urlencoded({ extended: false }))

// // parse application/json
// app.use(bodyParser.json())


// This will initialize the passport object on every request
app.use(passport.initialize());

const dbURL = 'mongodb://localhost/AliensDB';
const PORT = process.env.PORT || 9000

mongoose.connect(process.env.DB_CONNNECTION_STRING,
  { useNewUrlParser: true , useUnifiedTopology: true },
 (req, res) => {
  console.log("Connected to database");
});

app.listen(PORT, () => {
  console.log('listening on port 9000')
});