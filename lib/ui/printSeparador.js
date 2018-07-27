const stringWidth = require('string-width');
const getTamanhoTela = require('./getTamanhoTela');
const printLinha = require('./printLinha');

/**
 * Mostra uma mensagem e preenche o restante com um caracter de padding
 *
 * @param {string} mensagem a mensagem para mostrar
 * @param {object} opcoes opcoes que podem ser {posicao, padding}
 * @param {strimg} opcoes.posicao posicao da mensagem. 'inicio', 'meio', 'fim'
 * @param {strimg} opcoes.padding caracter usado para prencher o resto da linha
 */
function printSeparador(mensagem, { posicao = 'inicio', padding = ' ' } = {}) {
    const [larguraTela] = getTamanhoTela();
    const larguraLinha = larguraTela - 1;
    const tamanhoMensage = stringWidth(mensagem);
    const paddingLargura = (larguraLinha - tamanhoMensage) / 2;
    const inicioPadding = padding.repeat(Math.floor(paddingLargura));
    const fimPadding = padding.repeat(Math.ceil(paddingLargura));
    if (posicao === 'inicio') {
        printLinha(`${mensagem}${inicioPadding}${fimPadding}`);
    } else if (posicao === 'meio') {
        printLinha(`${inicioPadding}${mensagem}${fimPadding}`);
    } else if (posicao === 'fim') {
        printLinha(`${inicioPadding}${fimPadding}${mensagem}`);
    }
}

module.exports = printSeparador;
