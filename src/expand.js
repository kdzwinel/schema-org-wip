const { URL } = require("url");
const jsonld = require("jsonld");
const schemaOrgContext = require("../assets/jsonldcontext");
const SCHEMA_ORG_HOST = 'schema.org';

module.exports = function expand(inputObject) {
    let resolve, reject;
    const promise = new Promise((res, rej) => {resolve = res; reject = rej;});

    jsonld.expand(inputObject, {
        documentLoader: (url, callback) => {
            // console.log('ℹ️ documentLoader', url);
            let urlObj = null;

            try {
                urlObj = new URL(url);
            } catch (e) {
                reject('Error parsing URL: ', e.message);
                //
            }

            // jsonld.loadDocument(url, (e, obj) => {
            //     console.log('result', obj);

            //     callback(e, obj);
            // })

            if (urlObj && urlObj.host === SCHEMA_ORG_HOST && urlObj.pathname === '/') {
                callback(null, {
                    document: schemaOrgContext
                });
            } else {
                console.log('Unknown schema ', url);
                callback(null, {
                    document: {}
                });
            }
        }
    }, (e, expanded) => {
        if (e) {
            reject('Expansion error ', e);
        } else {
            resolve(expanded);
        }
    });

    return promise;
}