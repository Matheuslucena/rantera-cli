const arquivo = require('./utils/arquivo');
const Configuracao = require('./Configuracao');

jest.mock('./utils/arquivo');

describe('Configuracao', () => {
    let configuracao;

    beforeAll(() => {
        arquivo.recuperarArquivo = jest.fn().mockReturnValue({ base_url: 'https://rantera.esig.com.br/' });
        arquivo.criarArquivoJson = jest.fn();
        configuracao = new Configuracao();
    });

    test('deve recuperar todas as configuracoes', () => {
        arquivo.recuperarArquivo.mockReturnValue({ base_url: 'https://rantera.esig.com.br/' });
        const config = configuracao.getConfiguracao();
        expect(config).toEqual({ base_url: 'https://rantera.esig.com.br/' });
    });

    test('deve recuperar uma configuracao informada', () => {
        arquivo.recuperarArquivo.mockReturnValue({ base_url: 'https://rantera.esig.com.br/' });
        const config = configuracao.getConfiguracao('base_url');
        expect(config).toBe('https://rantera.esig.com.br/');
    });

    test('deve adicionar uma nova configuracao', () => {
        arquivo.recuperarArquivo.mockReturnValue({ base_url: 'https://rantera.esig.com.br/' });
        configuracao.setConfiguracao('nova', true);
        expect(arquivo.criarArquivoJson).toHaveBeenCalledWith('config.json', { base_url: 'https://rantera.esig.com.br/', nova: true });
    });

    test('deve adicionar varias configuracoes', () => {
        arquivo.recuperarArquivo.mockReturnValue({ base_url: 'https://rantera.esig.com.br/' });
        configuracao.setConfiguracao({ nova: true, outra: false });
        expect(arquivo.criarArquivoJson).toHaveBeenCalledWith('config.json', { base_url: 'https://rantera.esig.com.br/', nova: true, outra: false });
    });

    test('deve remover uma configuracao', () => {
        arquivo.recuperarArquivo.mockReturnValue({ base_url: 'https://rantera.esig.com.br/' });
        configuracao.deletarConfiguracao('base_url');
        expect(arquivo.criarArquivoJson).toHaveBeenCalledWith('config.json', { });
    });
});
