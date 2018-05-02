const fs = require("fs");
const csv = require("csv");

async function csvParse(text) {
    let resolve, reject;
    const promise = new Promise((res, rej) => {resolve = res; reject = rej;})

    csv.parse(text, function(err, data){
        if (err) {
            reject(err);
        } else {
            resolve(data);
        }
    });

    return promise;
}

async function main() {
    const result = new Map();

    // const propertiesText = fs.readFileSync(`./assets/schema-properties.csv`).toString();
    const typesText = fs.readFileSync(`./assets/schema-types.csv`).toString();

    // const properties = await csvParse(propertiesText);
    const types = await csvParse(typesText);

    // first row is a CSV header
    types.slice(1).forEach(([id,label,comment,subTypeOf,equivalentClass,props]) => {
        result.set(id, {
            props: props.split(',').map(prop => prop.trim().replace('http://schema.org/', '')),
            subTypeOf
        });
    });

    return result;
}

main()
    .catch(e => console.error(e))
    .then(data => {
        fs.writeFileSync('./assets/schema.json', JSON.stringify(Array.from(data), null, 2));
    });