const arquivo = require('./utils/arquivo');
const api = require('./utils/api');
const _ = require('lodash');
const { Spinner } = require('clui');
const chalk = require('chalk');
const sanitizeHtml = require('sanitize-html');
const decode = require('unescape');
const inquirer = require('inquirer');
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
// const git = require('simple-git/promise');
const printErro = require('./ui/printErro');
const printListaTarefa = require('./ui/printListaTarefa');
const printPlanejamentoAtual = require('./ui/printPlanejamentoAtual');
const printInformacaoTarefa = require('./ui/printInformacaoTarefa');
const printListaLogs = require('./ui/printListaLogs');
const formPlanejamento = require('./ui/formPlanejamento');
const formPesquisarTarefa = require('./ui/formPesquisarTarefa');

class Tarefa {
    constructor() {
        this.nomeArquivo = 'tarefas.json';
    }

    /**
     * Retorna todos os quadros com as tarefas salvas.
     *
     * @returns {object} quadros salvos
     */
    listaQuadros() {
        try {
            const json = arquivo.recuperarArquivo(this.nomeArquivo, true);
            return json.tarefas;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Retorna todas as tarefas dos quadros em um unico array
     *
     * @returns {array} tarefas salvas
     */
    listaTarefas() {
        try {
            return _.flatten(_.map(this.listaQuadros(), o => o.tarefas));
        } catch (err) {
            throw err;
        }
    }

    /**
     * Salva as tarefas em um arquivo.
     *
     * @param {object} tarefas a serem salvas
     */
    salvarTarefas(tarefas) {
        try {
            arquivo.criarArquivoJson(this.nomeArquivo, tarefas);
        } catch (err) {
            throw err;
        }
    }

    /**
     * Retorna o planejamento atual
     *
     * @returns {object} planejamento atual
     */
    getPlanejamentoAtual() {
        try {
            const json = arquivo.recuperarArquivo(this.nomeArquivo);
            return json.planejamentoAtual;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Retorna uma lista de planejamentos disponiveis
     *
     * @returns {Array} planejamentos do usuario
     */
    getListaPlanejamentos() {
        try {
            const json = arquivo.recuperarArquivo(this.nomeArquivo);
            return json.planejamentos;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Sincroniza as tarefas com o rantera e salva
     *
     */
    async sincronizarTarefas() {
        const status = new Spinner('Sincronizando tarefas...');
        status.start();
        try {
            const { req, body } = await api.tarefas();
            if (api.erroAcesso(req.res)) {
                printErro('Erro de acesso.');
                process.exit(0);
                return;
            }
            const quadro = JSON.parse(body);
            this.salvarTarefas({
                planejamentoAtual: quadro.planejamentoAtual.descricao,
                planejamentos: _.map(quadro.planejamentoList, i => this._formatarPlanejamentos(i)),
                tarefas: _.map(quadro.estagioBoardList, i => this._formatarQuadro(i)),
            });
            this.mostrarTarefas();
        } catch (err) {
            throw err;
        } finally {
            status.stop();
        }
    }

    /**
     * Pesquisa tarefa e mostra suas informacoes. As tarefas pesquisadas sao as salvas localmente.
     *
     */
    async pesquisarTarefa() {
        printPlanejamentoAtual(this.getPlanejamentoAtual());
        const { tarefa } = await formPesquisarTarefa(this.listaTarefas());
        await this.informacaoTarefa(tarefa);
    }

    /**
     * Mostra no console a lista de tarefas salvas localmente.
     *
     */
    mostrarTarefas() {
        printPlanejamentoAtual(this.getPlanejamentoAtual());
        printListaTarefa(this.listaQuadros());
    }

    /**
     * Altera o planejamento atual e sincronzia as tarefas.
     *
     */
    async alterarPlanejamento() {
        const escolhas = _.map(this.getListaPlanejamentos(), o =>
            ({ name: o.descricao, value: o.idPlanejamento }));
        const { id } = await formPlanejamento(escolhas);
        const status = new Spinner('Alterado Planejamento');
        status.start();
        await api.alterarPlanejamento(id);
        status.stop();
        await this.sincronizarTarefas();
    }

    /**
     * Carrega e mostra as informacoes da tarefa informada pelo numero ou selecionada no formulario.
     *
     * @param {string} numero
     */
    async informacaoTarefa(numero) {
        const status = new Spinner('Bucando informacoes da tarefas...');
        status.start();
        try {
            const { req, body } = await api.informacaoTarefa(numero);
            if (api.erroAcesso(req.res)) {
                printErro('Erro de acesso.');
                process.exit(0);
                return;
            }
            status.stop();
            const tarefa = this._formatarInformacaoTarefa(JSON.parse(body));
            const outrasInfo = {
                dataCadastro: tarefa.dataCadastro,
                responsavel: tarefa.responsavel,
                status: tarefa.status,
                logs: tarefa.logs.length,
                sqls: chalk.yellow(tarefa.totalSql),
            };
            printInformacaoTarefa(tarefa.descricao, outrasInfo);
            const mostrarLogs = await this._mostrarLogsForm();
            if (!mostrarLogs) return;
            printListaLogs(tarefa.logs);
        } catch (err) {
            throw err;
        } finally {
            status.stop();
        }
    }

    /**
     * Cria um branch com titulo da tarefa informada
     *
     * @param {*} numero tarefa a ser criado o branch
     */
    // async criarBranch(numero) { // TODO: Finalizar a criacao do branch
    //     let tituloTarefa = '';
    //     if (numero === undefined) {
    //         const form = await this._pesquisarForm(true);
    //         tituloTarefa = form.tarefa;
    //     } else {
    //         const tarefa = this.buscarPeloNumero(numero);
    //         tituloTarefa = tarefa.numeroTitulo;
    //     }
    //     tituloTarefa = _.snakeCase(_.deburr(tituloTarefa));

    //     const status = new Spinner('Criando o branch local...');
    //     status.start();
    //     const dir = await git().checkIsRepo();
    //     if (!dir) {
    //         console.log(`${chalk.yellow('O diretorio atual nao possue o git inicializado')}`);
    //         process.exit(0);
    //     }
    //     // const branch = await git().checkoutLocalBranch(tituloTarefa);
    //     // console.log(branch);
    // }

    buscarPeloNumero(numero) {
        const tarefas = this.listaTarefas();
        return _.find(tarefas, (o) => {
            const achou = _.includes(numero, o.numero);
            return achou;
        });
    }

    _formatarQuadro(quadro) {
        const tarefas = quadro.estagioBoardItemList;
        const nomeQuadro = quadro.denominacao;
        const tarefasFormatadas = this._formatarTarefas(tarefas);
        return { nomeQuadro, tarefas: tarefasFormatadas, total: tarefas.length };
    }

    _formatarTarefas(tarefas) {
        return _.sortBy(_.map(tarefas, (t) => {
            const tarefa = {
                numero: t.tarefa,
                titulo: t.titulo,
                numeroTitulo: `#${t.tarefa} - ${t.titulo}`,
                responsavel: t.responsavel.login,
            };
            return tarefa;
        }), ['numero']);
    }

    _formatarPlanejamentos(planejamento) {
        return { descricao: planejamento.descricao, idPlanejamento: planejamento.idPlanejamento };
    }

    _formatarInformacaoTarefa(json) {
        const { tarefa, logs } = json.informacoesDaTarefa;
        const descricao = decode(sanitizeHtml(
            tarefa.descricao,
            { allowedTags: [], allowedAttributes: [] },
        ));
        return {
            descricao,
            dataCadastro: tarefa.dataCadastro,
            responsavel: tarefa.responsavel.login,
            status: tarefa.status.denominacao,
            logs: _.map(logs, (l) => {
                const log = {
                    descricao: l.log,
                    data: l.data,
                    usuario: l.usuario,
                    sql: this._logSql(l),
                };
                return log;
            }),
            totalSql: this._totalSql(logs),
        };
    }

    _logSql(log) {
        return (log.log.indexOf('<pre name="code" class="sql">') > -1 && log.idBancoDeDados === null);
    }

    _totalSql(logs) {
        return _.filter(logs, (l) => {
            const sql = this._logSql(l);
            return sql;
        }).length;
    }

    _mostrarLogsForm() {
        const questions = [
            {
                name: 'mostrarLogs',
                type: 'confirm',
                message: 'Mostrar logs?',
                default: true,
            },
        ];
        return inquirer.prompt(questions);
    }
}

module.exports = Tarefa;
