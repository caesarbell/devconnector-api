const express = require('express'); 
const router = express.Router(); 
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const passport = require('passport');


/**
 * Load Input Validation 
 */
const validateRegisterInput = require('../../jobs/validation/register'); 
const validateLoginInput = require('../../jobs/validation/login'); 

const User = require('../../models/User'); 

const { getUserWebToken } = require('../../jobs/getUserWebToken'); 


/**
 * @route GET api/users/test
 * @desc Test users route 
 * @access Public 
 */

router.get('/test', (req, res) => res.json({msg: 'Users works'}));

/**
 * @route POST api/users/register
 * @desc Register user
 * @access Public
 */

 router.post('/register', (req, res) => {

     const { errors, isValid } = validateRegisterInput(req.body); 

    if(!isValid) {
        return res.status(400).json(errors); 
    }

    User.findOne({
        email: req.body.email
    })
    .then(user => {
        if(user) {
            errors.email = 'Email already exists'; 
            return res.status(400).json(errors); 
        } else {

            const email = req.body.email;
            
            
            /**
             * Gravator options
             * @s size
             * @r ratings (ie. pg, rated r, etc)
             * @d default value (ie. mm provides a default profile image)
             */

            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            }); 

            const newUser = new User({
                name: req.body.name,
                email,
                avatar,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err; 
                    newUser.password = hash; 
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.error(err)); 
                })
            })
        }
    })
 });


/**
 * @route POST api/users/login
 * @desc Login User / Returning JWT (JSON Web Token)
 * @access Public
 */

 router.post('/login', (req, res) => {

     const { errors, isValid } = validateLoginInput(req.body);

     if (!isValid) {
         return res.status(400).json(errors);
     }

    const email = req.body.email; 
    const password = req.body.password;

    User
        .findOne({ email })
        .then(user => {

            !user ? res.status(404).json(errors.email = 'User not found') : null; 

            bcrypt
                .compare(password, user.password)
                .then(isMatch => {

                    const payload = {id: user.id, name: user.name, avatar: user.avatar}; 

                    isMatch ? getUserWebToken(res, payload) : 
                    res.status(400).json(errors.password = 'Password incorrect'); 
                });
        })

 });


 /**
 * @route GET api/users/current
 * @desc Return current user
 * @access Private
 */

 router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json(req.user); 
 }); 

module.exports = router; 

