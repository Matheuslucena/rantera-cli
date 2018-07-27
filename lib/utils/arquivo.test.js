const fs = require('fs-extra');
const arquivo = require('./arquivo');

jest.mock('fs');

describe('Arquivo', () => {
    test('tem o diretorio base', () => {
        expect(arquivo.getDiretorioBase()).toBe('/Users/matheusmarques/.rantera/');
    });

    test('criou arquivo test.json no diretorio base', () => {
        fs.writeJsonSync = jest.fn();
        arquivo.criarArquivoJson('test.json', { test: true });
        expect(fs.writeJsonSync).toBeCalledWith('/Users/matheusmarques/.rantera/test.json', { test: true });
    });

    test('retornou uma excecao ao criar arquivo sem informar o nome', () => {
        expect(() => arquivo.criarArquivoJson('', {})).toThrowError('Informe o nome do arquivo');
    });

    test('retornou o conteudo do arquivo test.json no formato json', () => {
        fs.readFileSync.mockReturnValue('{"test": true }');
        fs.existsSync.mockReturnValue(true);
        const json = arquivo.recuperarArquivo('test.json', true);
        expect(fs.readFileSync).toBeCalledWith('/Users/matheusmarques/.rantera/test.json');
        expect(json).toEqual({ test: true });
    });

    test('retornou uma excecao ao retorna um arquivo sem informar o nome', () => {
        expect(() => arquivo.recuperarArquivo('')).toThrowError('Informe o nome do arquivo');
    });

    test('verifica se existe arquivo', () => {
        fs.existsSync = jest.fn().mockReturnValue(true);
        expect(() => arquivo.existeArquivo('test.json')).toBeTruthy();
    });

    test('retornou um objeto vazio caso arquivo nao exista', () => {
        fs.existsSync.mockReturnValue(false);
        expect(arquivo.recuperarArquivo('teste.json')).toEqual({});
    });
});
