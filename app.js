const express = require('express');
const expressLayout = require('express-ejs-layouts');
const app = express();
const mongoose = require('mongoose');

// db config
 const db = require('./config/keys').MongoURI;

 // connect to mongo
 mongoose.connect(db, {useNewUrlParser: true})
    .then(()=>console.log('MongoDB connected ... '))
    .catch(err =>console.log(err));
 

//ejs
app.use(expressLayout);
app.set('view engine','ejs');

// body parser
app.use(express.urlencoded({
    extended: false
}))

//routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`server started on port ${PORT}`));