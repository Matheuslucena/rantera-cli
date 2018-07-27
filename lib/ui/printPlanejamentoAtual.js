const printLinha = require('./printLinha');
const chalk = require('chalk');

/**
 * Mostra o titulo do planejamento atual em amarelo e quebra a linha.
 *
 * @param {string} planejamentoAtual titulo do planejamento atual
 */
function printPlanejamentoAtual(planejamentoAtual) {
    printLinha(`--> ${chalk.yellow(planejamentoAtual)}`);
}

module.exports = printPlanejamentoAtual;
