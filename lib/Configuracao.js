const arquivo = require('./utils/arquivo');
const _ = require('lodash');

class Configuracao {
    constructor() {
        this._nomeArquivo = 'config.json';
        this._garantirArquivoConfiguracao();
    }

    /**
     * Recupera o valor de uma configuracao informada
     *
     * @param {string} configuracao nome da configuracao
     * @returns {object} conteudo da configuracao
     */
    getConfiguracao(configuracao = null) {
        const config = arquivo.recuperarArquivo(this._nomeArquivo, true);
        if (configuracao) return config[configuracao];
        return config;
    }

    /**
     * Adiciona uma configuracao. Caso seja informado apenas um argumento do tipo objeto,
     * ele será salvo nas configuracoes.
     * Ex.: setConfiguracoes({chave1: valor1, chave2: valor2})
     *
     * @param {string | object} configuracao
     * @param {string | object} valor
     */
    setConfiguracao(configuracao, valor) {
        const config = this.getConfiguracao();
        if (arguments.length === 1) {
            _.each(Object.keys(configuracao), (k) => {
                config[k] = configuracao[k];
            });
        } else {
            config[configuracao] = valor;
        }
        arquivo.criarArquivoJson(this._nomeArquivo, config);
    }

    /**
     * Remove uma determinada configuracao salva
     *
     * @param {string} configuracao nome da configuracao
     */
    deletarConfiguracao(configuracao) {
        const config = this.getConfiguracao();
        delete config[configuracao];
        this.setConfiguracao(config);
    }

    /**
     * Reseta as configuracoes para a padrao
     *
     */
    resetarConfiguracoes() {
        this.setConfiguracao(this._configuracoesPadroes());
    }

    /**
     * Retorna as configuracoes padroes
     *
     * @private
     * @returns {object} configuracoes padroes
     */
    _configuracoesPadroes() {
        return {
            base_url: 'https://rantera.esig.com.br/',
        };
    }

    /**
     * Inicializa e cria o arquivo de configuracao caso ainda nao tenha sido criado
     *
     * @private
     */
    _garantirArquivoConfiguracao() {
        if (arquivo.existeArquivo(this._nomeArquivo)) return;
        this.setConfiguracao(this._configuracoesPadroes());
    }
}

module.exports = Configuracao;
