const chalk = require('chalk');
const printLinha = require('./printLinha');

/**
 * Monstra uma mensagem com a cor verde seguida de uma quebra de linha
 *
 * @param {string} mensagem
 */
function printSucesso(mensagem) {
    printLinha(chalk.green(mensagem));
}

module.exports = printSucesso;
