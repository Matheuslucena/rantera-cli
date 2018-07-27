const api = require('./api');
const http = require('./http');

jest.mock('./http');
jest.mock('../Autenticacao');
jest.mock('../Configuracao', () => jest.fn().mockImplementation(() => {
    const metodos = {
        getConfiguracao: jest.fn().mockReturnValue(''),
    };
    return metodos;
}));

describe('Api', () => {
    test('deve autenticar usuario', () => {
        http.post = jest.fn();
        api.autenticar('login', 'senha');
        expect(http.post).toHaveBeenCalledWith('login/login', { form: { login: 'login', password: 'senha' } });
    });

    test('deve requisitar tarefas', () => {
        http.get = jest.fn();
        api.tarefas();
        expect(http.get).toHaveBeenCalledWith({ url: 'agile/dashboard', headers: { Cookie: 'JSESSIONID=' } });
    });

    test('deve alterar o planejamento', () => {
        http.get = jest.fn();
        api.alterarPlanejamento(1);
        const opts = {
            url: 'agile/trocarPlanejamento',
            body: { idPlanejamento: '1' },
            json: true,
            headers: { Cookie: 'JSESSIONID=' },
        };
        expect(http.get).toHaveBeenCalledWith(opts);
    });

    test('deve carregar informacoes tarefa', () => {
        http.post = jest.fn();
        api.informacaoTarefa(1234);
        const opts = {
            url: 'carregarTarefa/info',
            qs: { numTarefa: 1234 },
            headers: { Cookie: 'JSESSIONID=' },
        };
        expect(http.post).toHaveBeenCalledWith(opts);
    });
});
