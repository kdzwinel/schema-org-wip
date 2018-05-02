const fs = require("fs");
const rawValidatorData = require("./assets/validator_output.json");
const schemaOrgTypeInfo = require("./assets/schema.json");

const MISSING_RECOMMENDED_FIELD = 'MISSING_RECOMMENDED_FIELD';
const MISSING_FIELD_WITHOUT_TYPE = 'MISSING_FIELD_WITHOUT_TYPE';
const EMPTY_FIELD_BODY = 'EMPTY_FIELD_BODY';

const types = new Map(schemaOrgTypeInfo);

rawValidatorData.tripleGroups.forEach(group => {
    const type = group.type;//console.log(group.type);
    const errors = [];

    group.nodes.forEach(({errors = []}) => {
        errors.forEach(({errorType, args}) => {
            if (errorType === EMPTY_FIELD_BODY || errorType === MISSING_FIELD_WITHOUT_TYPE) {
                console.log(type, errorType, args);
                const typeFull = `http://schema.org/${type}`;
                
                if (args.length !== 1) {
                    throw new Error('Unexpected number of args for type ' + typeFull);
                }

                if (!types.has(typeFull)) {
                    throw new Error('Unknown schema.org type ' + typeFull);
                }

                const typeObj = types.get(typeFull);

                typeObj.required = typeObj.required || [];
                typeObj.required.push(args[0])
            }
        })
    });
});

fs.writeFileSync('./assets/schema_google.json', JSON.stringify(Array.from(types), null, 2));
