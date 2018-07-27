const inquirer = require('inquirer');

/**
 * Mostra uma lista de planejamentos para o usuario escolher
 *
 * @param {Array} escolhas lista de planejamentos para escolher. Objeto: {name, value}
 */
async function formPlanejamento(escolhas) {
    const questionarios = [
        {
            name: 'id',
            type: 'list',
            message: 'Escolha o planejamento:',
            choices: escolhas,
        },
    ];
    return inquirer.prompt(questionarios);
}

module.exports = formPlanejamento;
