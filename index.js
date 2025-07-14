const tarefasPadrao = [
  { titulo: "Aprender JavaScript", etiqueta: "Estudo", data: "01/07/2025", concluida: false },
  { titulo: "Fazer exercício físico", etiqueta: "Saúde", data: "02/07/2025", concluida: false },
  { titulo: "Reunião com equipe", etiqueta: "Trabalho", data: "03/07/2025", concluida: true }
];

// armazena como variavel oque é informado pelos inputs
const form = document.getElementById('formulario');
const inputs = form.querySelectorAll('.form-input');
const contadorDOM = document.getElementById('contador');

let tarefas = [];
let tarefasConcluidas = 0;

// tenta buscar tarefas ja salvar no navegador
function carregarDoLocalStorage() {
  const tarefasSalvas = localStorage.getItem('tarefas');

  // É uma estrutura de tratamento de erro.
  if (tarefasSalvas) {
    try {
      tarefas = JSON.parse(tarefasSalvas);
    } catch (e) { //O e mostra o erro que aconteceu (é o erro capturado).
      tarefas = [];
      console.error('Erro ao carregar tarefas do localStorage:', e);
    }
  } else {
    tarefas = tarefasPadrao;
    salvarNoLocalStorage();
  }

  // Conta as concluídas com base no array
  tarefasConcluidas = tarefas.filter(t => t.concluida).length;

  // Ordenar: concluídas por último
  tarefas.sort((a, b) => a.concluida - b.concluida);

  // Cria os cards das tarefas na tela
  tarefas.forEach(tarefa => {
    criarTarefa(tarefa.titulo, tarefa.etiqueta, tarefa.data, tarefa.concluida, false);
  });

  atualizarContador();
}

// Transforma o array de tarefas em texto e salva no navegador
function salvarNoLocalStorage() {
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function criarTarefa(titulo, etiqueta, data, concluida = false, salvar = true) {
  const tarefaCard = document.createElement('div');
  tarefaCard.classList.add('tarefa-card');

  // Cria uma div com o conteúdo da tarefa e um botão "Concluir"
  tarefaCard.innerHTML = `
    <div class="tarefa-conteudo">
      <h5 class="titulo-tarefa">${titulo}</h5>
      <div class="tarefa-info">
        <span class="etiqueta">${etiqueta}</span>
        <span class="data-criacao">Criado em: ${data}</span>
      </div>
    </div>
    <button class="botao-concluir">Concluir</button>
  `;

  if (concluida) {
    const tituloEl = tarefaCard.querySelector('.titulo-tarefa');
    tituloEl.style.textDecoration = 'line-through';

    const botao = tarefaCard.querySelector('.botao-concluir');
    botao.innerHTML = '✔️';
    botao.disabled = true;
    botao.style.backgroundColor = '#ccc';
    botao.style.cursor = 'default';
  }

  const botao = tarefaCard.querySelector('.botao-concluir');
  botao.addEventListener('click', () => concluirTarefa(botao, tarefaCard, titulo, data));

  // Adiciona o card antes da linha divisória na tela
  const divisor = document.querySelector('.divisor');
  divisor.before(tarefaCard);
  // Se salvar for true (padrão), adiciona na lista e salva
  if (salvar) {
    tarefas.push({ titulo, etiqueta, data, concluida });
    salvarNoLocalStorage();
  }
}

// Previne que a página recarregue
form.addEventListener('submit', (event) => {
  event.preventDefault();
  //Pega o texto dos campos
  const titulo = inputs[0].value.trim();
  const etiqueta = inputs[1].value.trim();
  //Se estiver vazio, mostra alerta
  if (!titulo || !etiqueta) {
    alert('Preencha os dois campos!');
    return;
  }
  //  data de hoje  
  const hoje = new Date().toLocaleDateString('pt-BR');
  // cria a nova tarefa
  criarTarefa(titulo, etiqueta, hoje);

  // Limpa os campos e atualiza o contador
  inputs[0].value = '';
  inputs[1].value = '';
  atualizarContador();
});

// Roda quando o usuário clica no botão "Concluir"
function concluirTarefa(botao, tarefaCard, titulo, data) {
  const tituloEl = tarefaCard.querySelector('.titulo-tarefa');

  //Risca o texto e desativa o botão
  tituloEl.style.textDecoration = 'line-through';

  botao.innerHTML = '✔️';
  botao.disabled = true;
  botao.style.backgroundColor = '#ccc';
  botao.style.cursor = 'default';

  // Soma 1 ao contador e atualiza na tela
  tarefasConcluidas++;
  atualizarContador();
  //Procura essa tarefa no array e marca como concluída
  const tarefa = tarefas.find(t => t.titulo === titulo && t.data === data);
  if (tarefa) {
    tarefa.concluida = true;
  }

  salvarNoLocalStorage();
}
//Faz ajuste automático para singular/plural
function atualizarContador() {
  contadorDOM.textContent = `${tarefasConcluidas} tarefa${tarefasConcluidas !== 1 ? 's' : ''} concluída${tarefasConcluidas !== 1 ? 's' : ''}`;
}

// Chama ao carregar a página
window.onload = carregarDoLocalStorage;