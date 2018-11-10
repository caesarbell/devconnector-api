const Validator = require('validator');
const isEmpty = require('./is-empty');
const { startCase } = require('lodash');

module.exports = function validateProfileInput(data) {
    let errors = {};

    /**
     * This isEmpty is the global method for the project,
     * this checks to see if a value exists, if not then 
     * it will provide an empty string and we can then check 
     * that against the Validator isLength method, this is because 
     * isLength only accepts a string
     */
    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';

    if(!Validator.isLength(data.handle, {min: 2, max: 10})) {
        errors.handle = 'Handle needs to be between 2 and 10 characters';
    }


    /**
     * Check if fields are empty
     */

    const fields = ['handle', 'status', 'skills']; 

     fields.forEach(field => {
         if(Validator.isEmpty(data[field])) {
             errors[field] = `${startCase(field)} is required`; 
         }
     });

    /**
     * Not required, so we can check if it is not empty by our isEmpty method
     * If this returns true, and there is value in that field, then we run it 
     * against Validator isURL method, to check to see if it is a valid url 
     */

     const platforms = ['website', 'youtube', 'twitter', 'facebook', 'linkedin', 'instagrams']; 

     platforms.forEach(platform => {
         if(!isEmpty(data[platform])) {
             if(!Validator.isURL(data[platform])) {
                 errors[platform] = 'Not a valid url'; 
             }
         }
     });


    return {
        errors,
        isValid: isEmpty(errors)
    }
}