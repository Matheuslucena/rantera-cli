const inquirer = require('inquirer');
const chalk = require('chalk');
const _ = require('lodash');

/**
 * Mostra um campo para pesquisar as tarefas salvas.
 *
 * @param {Array} tarefas lista de tarefas
 * @param {boolean} retornarTitulo retornar somente o numero da tarefa ou
 *  o numero e titulo. Padrao: False
 */
function formPesquisarTarefa(tarefas, retornarTitulo = false) {
    const questionarios = [
        {
            name: 'tarefa',
            type: 'autocomplete',
            message: 'Pesquisar tarefa:',
            source: (respostas, input) => {
                const q = _.lowerCase(input) || '';
                return new Promise((resolve) => {
                    const titulos = _.map(tarefas, o =>
                        ({ value: !retornarTitulo ? o.numero : o.numeroTitulo, name: `${o.numeroTitulo} ${chalk.grey(`[${o.responsavel}]`)}` }));
                    const tarefasFiltradas = _.filter(titulos, o =>
                        _.lowerCase(o.name).includes(q));
                    resolve(tarefasFiltradas);
                });
            },
        },
    ];
    return inquirer.prompt(questionarios);
}

module.exports = formPesquisarTarefa;
