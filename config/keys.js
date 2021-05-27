if (process.env.NODE_ENV === 'production') {
    // production set of keys
    module.exports = require('./prodKeys');
} else {
    // development set of keys
    module.exports = require('./devKeys');
}