const chalk = require('chalk');
const columnify = require('columnify');
const printLinha = require('./printLinha');
const printSeparador = require('./printSeparador');

/**
 * Mostra as informacoes de uma tarefa.
 *
 * @param {string} descricao a descricao da tarefa
 * @param {object} outrasInformacoes tabela com outras informacoes da tarefa. Ex.: status
 */
function printInformacaoTarefa(descricao, outrasInformacoes) {
    const configColumn = {
        showHeaders: false,
        maxWidth: 140,
    };
    printSeparador(chalk.gray('**#**'), { posicao: 'meio', padding: chalk.gray('-') });
    printLinha(chalk.green('Descricao Tarefa:'));
    printLinha(columnify([{ descricao }], configColumn));
    printLinha('');
    configColumn.columnSplitter = ' | ';
    configColumn.showHeaders = true;
    configColumn.config = {
        logs: { align: 'center' },
        sqls: { align: 'center' },
    };
    printLinha(chalk.gray(columnify([outrasInformacoes], configColumn)));
    printSeparador(chalk.gray('**#**'), { posicao: 'meio', padding: chalk.gray('-') });
}

module.exports = printInformacaoTarefa;
