const fs = require("fs");
const rawValidatorData = require("./assets/validator_output.json");
const schemaOrgTypeInfo = require("./assets/schema.json");

const MISSING_RECOMMENDED_FIELD = 'MISSING_RECOMMENDED_FIELD';
const MISSING_FIELD_WITHOUT_TYPE = 'MISSING_FIELD_WITHOUT_TYPE';
const EMPTY_FIELD_BODY = 'EMPTY_FIELD_BODY';

const types = new Map(schemaOrgTypeInfo);

function processError(type, errorType, args) {
    if (errorType === EMPTY_FIELD_BODY || errorType === MISSING_FIELD_WITHOUT_TYPE || errorType === MISSING_RECOMMENDED_FIELD) {
        // console.log(type, errorType, args);
        const typeFull = `http://schema.org/${type}`;
        
        if (args.length !== 1) {
            throw new Error('Unexpected number of args for type ' + typeFull);
        }

        if (!types.has(typeFull)) {
            throw new Error('Unknown schema.org type ' + typeFull);
        }

        const typeObj = types.get(typeFull);
        const field = args[0];

        if (errorType === MISSING_RECOMMENDED_FIELD) {
            typeObj.recommended = typeObj.recommended || [];
            if (!typeObj.recommended.includes(field)) {
                typeObj.recommended.push(field);
            }
        } else {
            typeObj.required = typeObj.required || [];
            if (!typeObj.required.includes(field)) {
                typeObj.required.push(field);
            }
        }
    } else {
        // Unsupported errors
        // console.log(type, errorType, args);
    }
}

rawValidatorData.tripleGroups.forEach(group => {
    const errors = [];

    group.nodes.forEach(({typeGroup, errors = [], nodeProperties = []}) => {
        errors.forEach(({errorType, args}) => processError(typeGroup, errorType, args));
        nodeProperties.forEach(({target}) => {
            target.errors.forEach(({errorType, args}) => processError(target.typeGroup, errorType, args));
        })
    });
});

fs.writeFileSync('./assets/schema_google.json', JSON.stringify(Array.from(types), null, 2));
