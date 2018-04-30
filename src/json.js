const jsonlint = require('jsonlint-mod');

module.exports = function parseJSON(input) {
    jsonlint.parse(input);
    return JSON.parse(input);
}