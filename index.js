const fs = require("fs");
const validate = require("./src/validate");

async function main(examples) {
    for(let file of examples) {
        const input = fs.readFileSync(`./examples/${file}`).toString();

        console.log(`### ${file} ###`);
        await validate(input);
    }
}

const files = fs.readdirSync("./examples")
    .filter(file => file.indexOf('.json') !== -1);

main(files)
    .then(() => console.log('######'))
    .catch(e => console.log(e));