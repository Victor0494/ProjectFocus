const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
const formAdicionarTarefa = document.querySelector('.app__form-add-task');
const textArea = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list')
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description')

const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas')
const btnRemoverTodas = document.querySelector('#btn-remover-todas')


let tarefas = JSON.parse(localStorage.getItem('tarefas')) || []
let tarefaSelecionada = null
let litarefaSelecionada = null

function atualizarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas))
}

function criarElementoTarefa(tarefa) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svg = document.createElement('svg');
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `
    const paragrafo = document.createElement('p');
    paragrafo.classList.add('app__section-task-list-item-description')
    paragrafo.textContent = tarefa.descricao;

    const botao = document.createElement('button');
    botao.classList.add('app_button-edit')
    botao.onclick = () => {
        const novaDescricao = prompt("Qual é o novo nome da tarefa?")
        if(novaDescricao) {
            paragrafo.textContent = novaDescricao
            tarefa.descricao = novaDescricao
            atualizarTarefas()
        }
    }

    const imagemBotao = document.createElement('img');

    imagemBotao.setAttribute('src', '/imagens/edit.png');

    botao.append(imagemBotao);

    li.append(svg)
    li.append(paragrafo)
    li.append(botao)

    if(tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete')
        botao.setAttribute('disabled', 'disabled')
    } else {
        li.onclick = () => {
            document.querySelectorAll('.app__section-task-list-item-active')
                .forEach(element => {
                    element.classList.remove('app__section-task-list-item-active')
                })
            if(tarefaSelecionada == tarefa) {
                paragrafoDescricaoTarefa.textContent = ''
                tarefaSelecionada = null
                litarefaSelecionada = null
                return
            }
            tarefaSelecionada = tarefa
            litarefaSelecionada = li
            paragrafoDescricaoTarefa.textContent = tarefa.descricao
            
            li.classList.add('app__section-task-list-item-active')
        }
    }


    return li
}

btnAdicionarTarefa.addEventListener('click', () => {
    formAdicionarTarefa.classList.toggle('hidden'); //toggle tem o comportamento de alterar, nesse caso remover o valor descrito em uma classe, mas poderia adicionar também
})

formAdicionarTarefa.addEventListener('submit', (evento) => {
        evento.preventDefault();// esse método previne o padrão default 
        const tarefa = {
            descricao: textArea.value
        }
        tarefas.push(tarefa);
        //localStorage é quase um banco no navegador a informação fica lá até que você decida removê-la ou o usuário limpe os dados de navegação.
        const elementoTarefa = criarElementoTarefa(tarefa)
        ulTarefas.append(elementoTarefa)
        atualizarTarefas()
        textArea.value = ''
        formAdicionarTarefa.classList.add('hidden')
})

tarefas.forEach(tarefa => {
    const elementoTarefa = criarElementoTarefa(tarefa)
    ulTarefas.append(elementoTarefa)
});

document.addEventListener('FocoFinalizado', () => {
    if(tarefaSelecionada && litarefaSelecionada) {
        litarefaSelecionada.classList.remove('app__section-task-list-item-active')
        litarefaSelecionada.classList.add('app__section-task-list-item-complete')
        litarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled')
        tarefaSelecionada.completa = true
        atualizarTarefas()
    }
})

const removerTarefas = (somenteCompletas) => {
    const seletor = somenteCompletas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item"
    document.querySelectorAll(seletor).forEach(element => {
        element.remove()
    })
    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : []
    atualizarTarefas()
}

btnRemoverConcluidas.onclick = () => removerTarefas(true)
btnRemoverTodas.onclick = () => removerTarefas(false)