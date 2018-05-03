const walkObject = require("./helpers/walkObject");
const schemaStructure = new Map(require("../assets/schema_google"));
const TYPE_KEYWORD = '@type';

function cleanName(uri) {
    return uri.replace('http://schema.org/', '');
}

function getTypeSettingsForType(type) {
    const typeSettings = schemaStructure.get(type);

    return typeSettings;
}

function isKnownType(type) {
    return schemaStructure.has(type);
}

function validateObjectKeys(typeOrTypes, keys) {
    const errors = [];
    const safelist = [];
    const required = [];
    const recommended = [];

    let types = [];

    if (typeof typeOrTypes === 'string') {
        types.push(typeOrTypes);
    } else if (Array.isArray(typeOrTypes)) {
        types = typeOrTypes;
    } else {
        return ['Unknown value type'];
    }

    const unknownTypes = types.filter(t => !isKnownType(t));

    unknownTypes
        .forEach(type => {
            if (type.indexOf('http://schema.org/') === 0) {
                errors.push(`Unrecognized schema.org type ${type}`);
            }
        })

    if (unknownTypes && unknownTypes.length) {
        return errors;
    }

    types.forEach(type => {
        const typeSettings = getTypeSettingsForType(type);

        if(!typeSettings) {
            // should we fail here? type is unrecognized
        }

        if (typeSettings.props) {
            typeSettings.props.forEach(key => safelist.push(key));
        }

        if (typeSettings.required) {
            typeSettings.required.forEach(key => required.push(key));
        }

        if (typeSettings.recommended) {
            typeSettings.recommended.forEach(key => recommended.push(key));
        }
    });

    const cleanKeys = keys
        .filter(key => key.indexOf('@') !== 0)
        .map(key => cleanName(key));

    cleanKeys
        .filter(key => !safelist.includes(key))
        .forEach(key => errors.push(`Unexpected property "${key}"`));

    required
        .filter(key => !cleanKeys.includes(key))
        .forEach(key => errors.push(`Missing required property "${key}"`));

    recommended
        .filter(key => !cleanKeys.includes(key))
        .forEach(key => errors.push(`Missing recommended property "${key}"`));

    return errors;
}

module.exports = function validateSchemaOrg(expandedObj) {
    const errors = [];

    if (expandedObj.length === 1) {
        expandedObj = expandedObj[0];
    }

    walkObject(expandedObj, (name, value, path, obj) => {
        if (name === TYPE_KEYWORD) {            
            const keyErrors = validateObjectKeys(value, Object.keys(obj));

            keyErrors.forEach(e =>
                errors.push({
                    // get rid of /@type
                    path: '/' + path.slice(0, -1).map(cleanName).join('/'),
                    message: e
                })
            );
        }
    });

    return errors;
};