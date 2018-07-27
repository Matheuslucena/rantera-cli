const clearConsole = require('./clearConsole');

test('deve mostarar a logo e versao', () => {
    global.console = { log: jest.fn() };
    clearConsole.createTitle();
    expect(global.console.log).toHaveBeenCalledTimes(2);
});
