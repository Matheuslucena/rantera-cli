const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const _ = require('lodash');

const diretorioBase = path.join(os.homedir(), '.rantera/');

/**
 * Retorna o diretorio onde é salvo os arquivos do rantera.
 * Caso o diretorio nao exista ele sera criado
 *
 * @returns {string} caminho do diretorio base
 */
function getDiretorioBase() {
    return diretorioBase;
}

/**
 * Retorna se o arquivo existe
 *
 * @param {string} nome nome do arquivo para buscar
 * @returns {boolean}
 */
function existeArquivo(nome) {
    return fs.existsSync(path.join(getDiretorioBase(), nome));
}

/**
 * Cria um arquivo json com o conteudo informado
 *
 * @param {string} nome nome do arquivo a ser salvo
 * @param {object} json conteudo do arquivo a ser salvo
 */
function criarArquivoJson(nome, json = {}) {
    if (_.isEmpty(nome)) throw new Error('Informe o nome do arquivo');
    const caminho = path.join(getDiretorioBase(), nome);
    try {
        fs.writeJsonSync(caminho, json);
    } catch (err) {
        throw err;
    }
}

/**
 * Retorna o conteudo de um arquivo
 *
 * @param {string} nome nome do arquivo a ser buscado com a extensao. Ex.: config.json
 * @param {boolean} json retorna o conteudo do arquivo no formato json. Padrao = false
 */
function recuperarArquivo(nome, json = true) {
    const caminho = path.join(getDiretorioBase(), nome);
    if (_.isEmpty(nome)) throw new Error('Informe o nome do arquivo');
    if (!existeArquivo(nome)) return {};
    try {
        const conteudo = fs.readFileSync(caminho);
        if (json) return JSON.parse(conteudo);
        return conteudo;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    getDiretorioBase,
    existeArquivo,
    criarArquivoJson,
    recuperarArquivo,
};

