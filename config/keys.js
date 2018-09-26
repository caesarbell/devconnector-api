/**
 * Environment variables
 */

const mongoUser = process.env.MONGO_USER; 
const mongoDb = process.env.MONGO_DB; 
const mongoPassword = process.env.MONGO_PASSWORD; 

/**
 * current keys are for staging
 */

module.exports = {
    mongoURI: `mongodb://${mongoUser}:${mongoPassword}@ds133601.mlab.com:33601/${mongoDb}`,
    secretOrKey: 'secret'
};