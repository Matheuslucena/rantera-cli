const _ = require('lodash');
const columnify = require('columnify');
const chalk = require('chalk');
const sanitizeHtml = require('sanitize-html');
const decode = require('unescape');
const printLinha = require('./printLinha');
const printSeparador = require('./printSeparador');

function printListaLogs(logs) {
    const configColumn = {
        showHeaders: false,
        maxWidth: 140,
    };
    _.each(logs, (l) => {
        const descricao = decode(sanitizeHtml(
            l.descricao,
            { allowedTags: [], allowedAttributes: [] },
        ));
        printSeparador(chalk.gray(`${l.sql ? chalk.yellow('* ') : ''}${l.data} - ${l.usuario}`), { posicao: 'inicio', padding: '-' });
        printLinha(columnify([{ descricao }], configColumn));
        printLinha('');
    });
}

module.exports = printListaLogs;
