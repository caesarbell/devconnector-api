const express = require('express'); 
const mongoose = require('mongoose');

const api = './routes/api'; 

const users = require(`${api}/users`);
const profile = require(`${api}/profile`); 
const posts = require(`${api}/posts`);  

const app = express(); 

const db = require('./config/keys').mongoURI; 

mongoose
    .connect(db)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.get('/', (req, res) => res.send('hello'));

app.use('/api/users', users); 
app.use('/api/profile', profile); 
app.use('/api/posts', posts); 

const port = process.env.PORT || 3000; 

app.listen(port, () => console.log(`application is listening on port ${port}`)); 

