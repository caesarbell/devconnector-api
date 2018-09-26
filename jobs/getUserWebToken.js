const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

module.exports = {

    getUserWebToken: (res, {id, name, avatar}) => {

        const payload = {id, name, avatar }; 

        /**
         * Retrieve the web token & set an expiration for the token
         */

        return jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {

            res.json({
                success: true,
                token: `Bearer ${token}`
            });
        }); 
    }
}