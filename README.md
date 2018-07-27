# Rantera CLI
Interface de linha de comando para o Rantera.

# Instala&ccedil;&atilde;o
Tenha o **node.js** instalado e no terminal rode o comando: 

`cd caminho_rantera`

`npm install -g ./`
 
# Comandos:

## > login
Autentica o usuário no rantera através do login e senha.

* **Ex.:** `rantera login`

## > list (ls)
Lista as tarefas do rantera que estiverem salvas.
* **Ex.:** `rantera list`
* **Alias:** `ls`

| Op&ccedil;&otilde;es | Descri&ccedil;&atilde;o                            |
| -------------------- | -------------------------------------------------- |
| `-r --refresh`       | Recarrega as tarefas do planejamento atual e salva |

## > sprint (spr)
Altera o planejamento atual
* **Ex.:** `rantera sprint`

## > copy <...ids> (cp)
Copia o titulo das tarefas informadas para a area de transfer&ecirc;ncia. Aceita como par&acirc;metro vários número de tarefas.
* **Ex.:** `ratera copy -t ${numero_tarefa}`

| Op&ccedil;&otilde;es | Descri&ccedil;&atilde;o                            |
| -------------------- | -------------------------------------------------- |
| `-t --title`         | Copia os t&iacute;tulos das tarefas informada      |

## > branch <id> (br)
Cria um branch ,a partir do master, com o t&iacute;tulo da tarefa informada. Para rodar este comando deve-se está dentro do diretorio que tenha um .git configurado.
* **Ex.:** `ratera branch ${numero_tarefa}`

## > export [dir] (exp)
Exporta as tarefas do planejamento atual para o formato escolhido (excel, text) no diretorio informado. Caso nenhum diretorio seja informado será exportado par ao atual.
* **Ex.:** `ratera export ./`

| Op&ccedil;&otilde;es | Descri&ccedil;&atilde;o                            |
| -------------------- | -------------------------------------------------- |
| `-s --select`        | Selecionar quais tarefas exportar                  |

# Todo List:
- [x] Efetuar o login no rantera.
- [x] Listar as tarefas do planejamento atual e recarrega-las.
- [x] Alterar o planejamento.
- [x] Copiar título das tarefas informadas para a área de transfer&eacirc;cia(clipboard).
- [ ] Criar um branch apartir da tarefa informda. O branch deverá ser criado apartir do master
- [ ] Exporta as tarefas do planejamento atual para o formato escolhido(excel ou txt)
- [ ] Alterar o local de salvamento dos arquivos para o caminho: HOME/.rantera/
- [ ] Pesquisar tarefa e ao selecionar mostrar o log dela
- [ ] Renomear as classes