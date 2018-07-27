#!/usr/bin/env node

const program = require('commander');
const clearConsole = require('../lib/utils/clearConsole');
const Autenticacao = require('../lib/Autenticacao');
const Tarefa = require('../lib/Tarefa');
const printErro = require('../lib/ui/printErro');
const chalk = require('chalk');

const tarefa = new Tarefa();

program
    .version(require('../package').version)
    .usage('<command>');

program
    .command('login')
    .description('autentica-se ao rantera')
    .action(() => {
        clearConsole.createTitle();
        new Autenticacao().entrar();
    });

program
    .command('list')
    .alias('ls')
    .description('mostra todas as tarefas salvas')
    .option('-r, --refresh', 'Recarrega as tarefas salvas')
    .action((opts) => {
        clearConsole.createTitle();
        if (opts.refresh === true) {
            tarefa.sincronizarTarefas();
        } else {
            tarefa.mostrarTarefas();
        }
    });

program
    .command('sprint')
    .alias('spr')
    .description('altera o planejamento atual')
    .action(() => {
        clearConsole.createTitle();
        tarefa.alterarPlanejamento();
    });

program
    .command('find')
    .alias('fd')
    .description('buscar tarefa no planejamento atual')
    .action(() => {
        clearConsole.createTitle();
        tarefa.pesquisarTarefa();
    });

program
    .command('branch [numeroTarefa]')
    .alias('br')
    .description('criar um branch da tarefa')
    .action((numeroTarefa) => {
        clearConsole.createTitle();
        tarefa.criarBranch(numeroTarefa);
    });

program
    .arguments('<command>')
    .action((cmd) => {
        program.outputHelp();
        console.log();
        printErro(`    Comando desconhecido ${chalk.yellow(cmd)}.`);
        console.log();
    });

program.on('--help', () => {
    console.log();
    console.log(`  Execute ${chalk.cyan('rantera <comando> --help')} para detalhes de uso do comando.`);
    console.log();
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}
