const {URL} = require("url");
const walkObject = require("./helpers/walkObject");

const CONTEXT = '@context';
const KEYWORDS = [
    '@base',
    '@container',
    CONTEXT,
    '@graph',
    '@id',
    '@index',
    '@language',
    '@list',
    '@nest',
    '@none',
    '@prefix',
    '@reverse',
    '@set',
    '@type',
    '@value',
    '@version',
    '@vocab'
];

function validURL(url) {
    try {
        new URL(url);
    } catch(e) {
        return false;
    }

    return true;
}

function validKeyword(fieldName) {
    return KEYWORDS.includes(fieldName);
}

function validContextValue(contextValue) {
    if (typeof contextValue === 'string') {
        return validURL(contextValue);
    }

    return true;
}

function validateField(name, value, path, context) {
    if (name[0] === '@') {
        if(!validKeyword(name)) {
            return 'Unknown keyword';
        }

        if(name === CONTEXT && !validContextValue(value)) {
            return `Invalid ${CONTEXT} value`;
        }
    }

    return null;
}

module.exports = function validateJsonLD(json) {
    let errors = [];

    walkObject(json, (name, value, path, object) => {
        const error = validateField.call(null, name, value, path, object);

        if (error) {
            errors.push({
                path: path.join('/'),
                message: error
            });
        }
    });

    return errors;
};