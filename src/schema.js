const walkObject = require("./helpers/walkObject");
const schemaStructure = new Map(require("../assets/schema"));
const TYPE_KEYWORD = '@type';

function cleanName(uri) {
    return uri.replace('http://schema.org/', '');
}

function getKeySafelistForType(type) {
    const keys = schemaStructure.get(type);

    return keys;
}

function isKnownType(type) {
    return schemaStructure.has(type);
}

function validateObjectKeys(typeOrTypes, keys) {
    const errors = [];
    const safelist = [];

    let types = [];

    if (typeof typeOrTypes === 'string') {
        types.push(typeOrTypes);
    } else if (Array.isArray(typeOrTypes)) {
        types = typeOrTypes;
    } else {
        return ['Unknown value type'];
    }

    if (!types.every(isKnownType)) {
        return [];
    }

    types.forEach(type => {
        const typeSafelist = getKeySafelistForType(type);

        if (typeSafelist) {
            typeSafelist.forEach(key => safelist.push(key));
        } else {
            // should we fail here? type is unrecognized
        }
    });

    keys
        .filter(key => key.indexOf('@') !== 0)
        .filter(key => !safelist.includes(cleanName(key)))
        .forEach(key => errors.push(`Unexpected property "${key}"`));

    return errors;
}

module.exports = function validateSchemaOrg(expandedObj) {
    const errors = [];

    walkObject(expandedObj, (name, value, path, obj) => {
        if (name === TYPE_KEYWORD) {            
            const keyErrors = validateObjectKeys(value, Object.keys(obj));

            keyErrors.forEach(e =>
                errors.push({
                    path: path.slice(0, -1).map(cleanName).join('/'),
                    message: e
                })
            );
        }
    });

    return errors;
};