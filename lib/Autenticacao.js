const inquirer = require('inquirer');
const { Spinner } = require('clui');
const chalk = require('chalk');
const Configuracao = require('./Configuracao');
const api = require('./utils/api');

const config = new Configuracao();

class Autenticacao {
    constructor() {
        this._token = 'token_autenticacao';
    }
    /**
    * Mostra um formulario de autenticacao com login e senha e autentica o usuario no rantera.
    *
    */
    async entrar() {
        const { login, senha } = await this._loginForm();
        this._salvarLogin(login);
        await this.autenticar(login, senha);
    }

    /**
     * Faz a requisicao para autenticar o usuario no rantera
     * e salva o token de autenticacao
     *
     * @param {string} login login utilizado para autenticacao
     * @param {string} senha senha utilizada para autenticacao
     */
    async autenticar(login, senha) {
        const status = new Spinner('Autenticando, por favor aguarde...');
        try {
            status.start();
            const { statusCode, rawHeaders } = await api.autenticar(login, senha);
            if (statusCode !== 302) {
                console.log(`\n ${chalk.red('Falha ao logar..')}`);
                this.logout();
                return false;
            }
            console.log(`\n ${chalk.green('Logado com sucesso..')}`);
            this.token = this._extrairToken(rawHeaders);
            return true;
        } catch (err) {
            throw err;
        } finally {
            status.stop();
        }
    }

    /**
     * Remove o token de autenticacao salvo
     */
    logout() {
        config.deletarConfiguracao(this._token);
    }

    /**
     * Recupera o token de configuracao
     *
     * @returns {string} token de autenticacao
     */
    get token() {
        return config.getConfiguracao(this._token);
    }

    /**
     * Seta o token de configuracao
     *
     * @param {string} val token de autenticacao
     */
    set token(val) {
        config.setConfiguracao(this._token, val);
    }

    /**
     * Cria o formulario de autenticacao
     *
     * @private
     * @returns {object} retorna um objeto contendo o {login, senha} informado
     */
    _loginForm() {
        const formulario = [
            {
                name: 'login',
                type: 'input',
                message: 'Insira seu login do Rantera:',
                default: this._ultimoLogin(),
                validate: (value) => {
                    if (value.length) {
                        return true;
                    }
                    return 'Por favor insira seu login.';
                },
            },
            {
                name: 'senha',
                type: 'password',
                message: 'Insira sua senha:',
                validate: (value) => {
                    if (value.length) {
                        return true;
                    }
                    return 'Por favor insira sua senha.';
                },
            },
        ];
        return inquirer.prompt(formulario);
    }

    /**
     * Salva o ultimo login informado para autenticacao, para ser utilizado no proximo login.
     *
     * @private
     * @param {string} login login utilizado
    */
    _salvarLogin(login) {
        config.setConfiguracao('ultimo_login', login);
    }

    /**
     * Recupera o ultimo login utilizado na autenticacao
     *
     * @private
     * @returns {string} ultimo login utilizado
     */
    _ultimoLogin() {
        return config.getConfiguracao('ultimo_login');
    }

    /**
     * Extrai o token de autenticacao do header.
     *
     * @private
     * @param {string} headers cabecalho da requisicao para extrair o token
     * @returns {string} retorna o token extraido
     */
    _extrairToken(headers) {
        const regex = /JSESSIONID=(.*?);/g;
        const m = regex.exec(headers);
        if (!m.length) return null;

        return m[1];
    }
}

module.exports = Autenticacao;
