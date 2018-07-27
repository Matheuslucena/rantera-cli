const chalk = require('chalk');
const figlet = require('figlet');
const clear = require('clear');
const current = require('../../package.json').version;

module.exports = {
    createTitle: () => {
        clear();
        console.log(chalk.bold.hex('#9a1421')(figlet.textSync('RanteraCLI', { horaizontalLayout: 'full' })));
        console.log(`v${current}`);
    },
};
