const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
    let errors = {};

    /**
     * This isEmpty is the global method for the project
     */

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    if (!Validator.isLength(data.password, { min: 2, max: 30 })) {
        errors.password = 'Password must be at least 6 characters, but no more then 30';
    }

    /**
     * This .isEmpty is the Validator isEmpty method
     */
    const fields = ['email', 'password'];

    const validator = (value) => {
        const field = value;

        Validator.isEmpty(data[field]) ? errors[field] = `${field} field is require` : null;
    }

    fields.forEach((field) => {
        validator(field);
    });


    return {
        errors,
        isValid: isEmpty(errors)
    }
}