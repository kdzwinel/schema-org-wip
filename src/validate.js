const parseJSON = require("./json");
const validateJsonLD = require("./jsonld");
const promiseExpand = require("./expand");
const validateSchemaOrg = require("./schema");

module.exports = async function validate(textInput) {
    /// VALIDATE JSON
    let inputObject;

    try {
        inputObject = parseJSON(textInput);
    } catch (e) {
        console.log(`💥 JSON error: ${e.message}`);
        return;
    }
    //console.log('👌 valid JSON');

    // VALIDATE JSONLD
    const jsonLdErrors = validateJsonLD(inputObject);

    if (jsonLdErrors && jsonLdErrors.length) {
        jsonLdErrors.forEach(error => {
            console.log(`💥 JSON-LD error: ${error.path} ${error.message}`);
        });
        return;
    }
    //console.log('👌 valid JSON-LD');

    // EXPAND
    let expandedObj = null;
    try {
        expandedObj = await promiseExpand(inputObject)
    } catch(e) {
        console.log('💥 ' + e);
    }
    //console.log('👌 expansion went well');

    // VALIDATE SCHEMA
    const schemaOrgErrors = validateSchemaOrg(expandedObj);

    if (schemaOrgErrors && schemaOrgErrors.length) {
        schemaOrgErrors.forEach(error => {
            console.log(`💥 schema.org error: ${error.path} ${error.message}`);
        });
        return;
    }
    //console.log('👌 no schema.org errors');
}