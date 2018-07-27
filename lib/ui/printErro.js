const chalk = require('chalk');
const printLinha = require('./printLinha');

/**
 * Monstra uma mensagem com a cor vermelha seguida de uma quebra de linha
 *
 * @param {string} mensagem
 */
function printErro(mensagem) {
    printLinha(chalk.red(mensagem));
}

module.exports = printErro;
