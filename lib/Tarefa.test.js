const arquivo = require('./utils/arquivo');
const api = require('./utils/api');
const printPlanejamentoAtual = require('./ui/printPlanejamentoAtual');
const printListaTarefa = require('./ui/printListaTarefa');
const formPesquisarTarefa = require('./ui/formPesquisarTarefa');
const Tarefa = require('./Tarefa');

jest.mock('./utils/arquivo');
jest.mock('./Configuracao');
jest.mock('./utils/api');
jest.mock('./ui/printPlanejamentoAtual');
jest.mock('./ui/printListaTarefa');
jest.mock('./ui/formPesquisarTarefa');

describe('Tarefa', () => {
    let tarefa;

    beforeAll(() => {
        arquivo.recuperarArquivo = jest.fn().mockReturnValue({ tarefas: [] });
        tarefa = new Tarefa();
    });

    test('deve listar os quadros salvos', () => {
        tarefa.listaQuadros();
        expect(arquivo.recuperarArquivo).toBeCalledWith('tarefas.json', true);
    });

    test('deve listar as tarefas salvas', () => {
        arquivo.recuperarArquivo = jest.fn().mockReturnValue({
            tarefas: [
                { tarefas: [{ numero: 1, titulo: 'Teste 1' }] },
                { tarefas: [{ numero: 2, titulo: 'Teste 2' }] },
            ],
        });
        expect(tarefa.listaTarefas()).toEqual([{ numero: 1, titulo: 'Teste 1' }, { numero: 2, titulo: 'Teste 2' }]);
    });

    test('deve salvar tarefas', () => {
        arquivo.criarArquivoJson = jest.fn();
        tarefa.salvarTarefas({});
        expect(arquivo.criarArquivoJson).toBeCalledWith('tarefas.json', {});
    });

    test('deve retornar o planejamento atual', () => {
        arquivo.recuperarArquivo = jest.fn().mockReturnValue({ planejamentoAtual: { nome: 'teste' } });
        expect(tarefa.getPlanejamentoAtual()).toEqual({ nome: 'teste' });
    });

    test('deve retorna a lista de planejamentos', () => {
        arquivo.recuperarArquivo = jest.fn().mockReturnValue({ planejamentos: [{ nome: 'teste' }] });
        expect(tarefa.getListaPlanejamentos()).toEqual([{ nome: 'teste' }]);
    });

    test('deve sincronizar as tarefas', async () => {
        api.tarefas = jest.fn().mockReturnValue({
            body: JSON.stringify({
                planejamentoAtual: { descricao: 'teste' },
                planejamentoList: [{ descricao: 'p1', idPlanejamento: 1 }],
                estagioBoardList: [{ estagioBoardItemList: [{ tarefa: 1, titulo: 't1', responsavel: { login: 'u1' } }], denominacao: 'q1' }],
            }),
            req: {},
        });
        tarefa.mostrarTarefas = jest.fn();
        tarefa.salvarTarefas = jest.fn();
        expect.assertions(1);
        await tarefa.sincronizarTarefas();
        expect(tarefa.salvarTarefas).toBeCalledWith({
            planejamentoAtual: 'teste',
            planejamentos: [{ descricao: 'p1', idPlanejamento: 1 }],
            tarefas: [{
                nomeQuadro: 'q1',
                tarefas: [{
                    numero: 1, titulo: 't1', numeroTitulo: '#1 - t1', responsavel: 'u1',
                }],
                total: 1,
            }],
        });
    });

    test('deve pesquisar tarefas', async () => {
        expect.assertions(3);
        formPesquisarTarefa.mockResolvedValue({ tarefa: 1234 });
        tarefa.informacaoTarefa = jest.fn().mockResolvedValue(true);
        await tarefa.pesquisarTarefa();
        expect(printPlanejamentoAtual).toHaveBeenCalled();
        expect(formPesquisarTarefa).toHaveBeenCalled();
        expect(tarefa.informacaoTarefa).toHaveBeenCalledWith(1234);
    });

    test('deve mostrar tarefas', () => {
        tarefa.mostrarTarefas();
        expect(printPlanejamentoAtual).toBeCalled();
        expect(printListaTarefa).toBeCalled();
    });

    test.only('deve alterar o planejamento', () => {

    });
});
