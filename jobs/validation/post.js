const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
    let errors = {};

    /**
     * This isEmpty is the global method for the project
     */

    data.text = !isEmpty(data.text) ? data.text : '';


    if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
        errors.text = 'Post must be between 10 and 300 characters';
    }

    /**
     * This .isEmpty is the Validator isEmpty method
     */
    const fields = ['text'];

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