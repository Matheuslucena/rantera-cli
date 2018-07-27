const http = require('./http');
const Configuracao = require('../Configuracao');

const config = new Configuracao();
const baseUrl = config.getConfiguracao('base_url');

/**
 * Concatena a url passada com a url base
 *
 * @private
 * @param {string} url
 *
 * @returns {string}
 */
function _url(url) {
    return `${baseUrl}${url}`;
}

/**
 * Cria o objeto com o token de acesso que é utilizado no header das requisicoes
 *
 * @returns {object}
 */
function _tokenAcesso() {
    return { Cookie: `JSESSIONID=${config.getConfiguracao('token_autenticacao')}` };
}

module.exports = {
    /**
    * Faz a requisicao para autenticacao do usuario
    *
    * @param {string} login
    * @param {string} password
    * @returns {Promise}
    */
    autenticar: (login, password) => {
        const params = { login, password };
        return http.post(_url('login/login'), { form: params });
    },
    /**
    * Faz a requisicao para buscar todas as tarefas do planejamento atual
    *
    * @returns {Promise}
    */
    tarefas: () => http.get({ url: _url('agile/dashboard'), headers: _tokenAcesso() }),
    /**
    * Faz a requisicao para alterar o planejamento atual
    *
    * @returns {Promise}
    */
    alterarPlanejamento: (id) => {
        const opts = {
            url: _url('agile/trocarPlanejamento'),
            body: { idPlanejamento: `${id === null ? '' : id}` },
            json: true,
            headers: _tokenAcesso(),
        };
        return http.get(opts);
    },
    informacaoTarefa: (id) => {
        const opts = {
            url: _url('carregarTarefa/info'),
            qs: { numTarefa: id },
            headers: _tokenAcesso(),
        };
        return http.post(opts);
    },
    erroAcesso: (res) => {
        if (!res || res.statusCode === 302) {
            config.deletarConfiguracao('token_autenticacao');
            return true;
        }
        return false;
    },
};
