/**
 * Retorna o tamanho da tela
 *
 * @returns {number []} o tamanho da tela em um array [width, height]
 */

function getTamanhoTela() {
    return [process.stdout.columns, process.stdout.rows];
}

module.exports = getTamanhoTela;
