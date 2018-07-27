const chalk = require('chalk');
const printLinha = require('./printLinha');

/**
 * Monstra uma mensagem com a cor amarela seguida de uma quebra de linha
 *
 * @param {string} mensagem
 */
function printAlerta(mensagem) {
    printLinha(chalk.yellow(mensagem));
}

module.exports = printAlerta;
