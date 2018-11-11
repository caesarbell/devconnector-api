const express = require('express'); 
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport'); 
const cors = require('cors')

const api = './routes/api'; 

const users = require(`${api}/users`);
const profile = require(`${api}/profile`); 
const posts = require(`${api}/posts`);  

const jwtConfig = require('./config/passport'); 

const app = express(); 

const db = require('./config/keys').mongoURI; 


/**
 * CORS configuration 
 * Provides which domains can speak with the API from the browser 
 */

var corsOptions = {
    origin: ['http://localhost:3000', 'https://festive-aryabhata-e098d1.netlify.com'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

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

app.use(cors(corsOptions));

app.use('/api/users', users); 
app.use('/api/profile', profile); 
app.use('/api/posts', posts); 

const port = process.env.PORT || 5000; 

app.listen(port, () => console.log(`application is listening on port ${port}`)); 

