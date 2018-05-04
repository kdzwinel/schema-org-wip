const fs = require("fs");
const validate = require("./src/validate");
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

async function main(examplesFile) {
    const examplesText = fs.readFileSync(examplesFile).toString();
    const examples = await csvParse(examplesText);

    for(let i = 1; i < examples.length; i++) {
        const [rank, url, data] = examples[i];

        console.log(`### ${url} ###`);
        await validate(data);
    }

}

const files = fs.readdirSync("./examples")
    .filter(file => file.indexOf('.json') !== -1);

main('assets/http-archive.csv')
    .then(() => console.log('######'))
    .catch(e => console.log(e));