const Validator = require('validator'); 
const isEmpty = require('./is-empty'); 
const { startCase } = require('lodash');

module.exports = function validateRegisterInput(data) {
    let errors = {}; 

    /**
     * This isEmpty is the global method for the project
     */
    data.name = !isEmpty(data.name) ? data.name : ''; 
    data.email = !isEmpty(data.email) ? data.email : ''; 
    data.password = !isEmpty(data.password) ? data.password : ''; 
    data.password2 = !isEmpty(data.password2) ? data.password2 : ''; 



    if(!Validator.isLength(data.name, {min: 2, max: 30})) {
        errors.name = 'Name must be between 2 and 30 characters'; 
    }

    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = 'Password must match';
    }

    if (!Validator.isLength(data.password, { min: 2, max: 30 })) {
        errors.password = 'Password must be at least 6 characters, but no more then 30';
    }

    if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    /**
     * This .isEmpty is the Validator isEmpty method
     */
    const fields = ['name', 'email', 'password', 'password2']; 

    const validator = (value) => {
        const field = value; 

        Validator.isEmpty(data[field]) ? errors[field] = `${startCase(field) } field is require` : null; 

        if(field === 'password2') {

            Validator.isEmpty(data.password2) ? errors.password2 = 'Confirm Password field is required' : null; 
        }
    }

    fields.forEach((field) => {
        validator(field); 
    });
   

    return {
        errors, 
        isValid: isEmpty(errors)
    }
}