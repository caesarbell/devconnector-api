const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateEducationInput(data) {
    let errors = {};

    /**
     * This isEmpty is the global method for the project
     */

    data.school = !isEmpty(data.school) ? data.school : '';
    data.degree = !isEmpty(data.degree) ? data.degree : '';
    data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    /**
     * This .isEmpty is the Validator isEmpty method
     */
    const fields = ['school', 'degree', 'fieldofstudy', 'from'];

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