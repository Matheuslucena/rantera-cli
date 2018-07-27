const printLinha = require('./printLinha');
const _ = require('lodash');
const columnify = require('columnify');
const chalk = require('chalk');

/**
 * Mostra a lista de quadros e suas tarefas.
 *
 * @param {Array} quadros lista de quadros com as tarefas
 */
function printListaTarefa(quadros) {
    _.map(quadros, (quadro) => {
        if (quadro.total === 0) return;
        const tarefas = _.map(quadro.tarefas, o => ({ tarefa: o.numeroTitulo, responsavel: chalk.grey(`[${o.responsavel}]`) }));
        const colunas = columnify(tarefas, { showHeaders: false });
        printLinha(chalk.cyan(`${quadro.nomeQuadro} [${quadro.total}]`));
        printLinha(colunas);
        printLinha('');
    });
}

module.exports = printListaTarefa;
