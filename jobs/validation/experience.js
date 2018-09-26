const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
    let errors = {};

    /**
     * This isEmpty is the global method for the project
     */

    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    /**
     * This .isEmpty is the Validator isEmpty method
     */
    const fields = ['title', 'company', 'from'];

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