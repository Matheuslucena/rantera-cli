const print = require('./print');

/**
 * Mostra uma mensagem no console e quebra a linha.
 *
 * @param {string} mensagem
 */
function printLinha(mensagem) {
    print(`${mensagem}\n`);
}

module.exports = printLinha;
