const express = require('express'); 
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport'); 

const api = './routes/api'; 

const users = require(`${api}/users`);
const profile = require(`${api}/profile`); 
const posts = require(`${api}/posts`);  
const jwtConfig = require('./config/passport'); 

const app = express(); 

const db = require('./config/keys').mongoURI; 

/**
 * Body Parser Middleware 
 */

 app.use(bodyParser.urlencoded({extended: false})); 
 app.use(bodyParser.json()); 

mongoose
    .connect(db)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


/**
 * Passport Middleware
 */

 app.use(passport.initialize()); 

 /**
  * Passport Config
  */

jwtConfig(passport); 

app.use('/api/users', users); 
app.use('/api/profile', profile); 
app.use('/api/posts', posts); 

const port = process.env.PORT || 3000; 

app.listen(port, () => console.log(`application is listening on port ${port}`)); 

