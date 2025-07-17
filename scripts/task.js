const taskInput = document.getElementById('taskInput');
const priorityInput = document.getElementById('priorityInput');
const taskTableBody = document.getElementById('taskTableBody');
const taskCardsContainer = document.getElementById('taskCardsContainer');

let tasks = [];


document.getElementById('taskForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const text = taskInput.value.trim();
  const priority = priorityInput.value;

  if (!text || !priority) {
    if (!text) showAlert('Por favor, preencha o campo de tarefa.');
    if (!priority) showAlert('Por favor, selecione uma prioridade.');
    return;
  }

  const task = {
    id: Date.now(),
    text: escapeHTML(text),
    priority
  };

  tasks.push(task);
  renderTasks();
  showSuccessToast(task.text, 'adicionada');

  taskInput.value = '';
  priorityInput.selectedIndex = 0;
});

function renderTasks() {
  taskTableBody.innerHTML = '';
  taskCardsContainer.innerHTML = '';

  tasks.forEach(task => {

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${task.text}</td>
      <td><span class="badge px-3 ${getPriorityClass(task.priority)}">${task.priority}</span></td>
      <td><button class="btn btn-success">Concluir</button></td>
    `;
    tr.querySelector('button').addEventListener('click', () => completeTask(task.id));
    taskTableBody.appendChild(tr);

    const card = document.createElement('div');
    card.className = 'task-card my-2';
    card.innerHTML = `
      <div class="task-text">${task.text}</div>
      <div class="task-priority"><span class="badge px-3 ${getPriorityClass(task.priority)}">${task.priority}</span></div>
      <div class="task-action"><button class="btn btn-success">Concluir</button></div>
    `;
    card.querySelector('button').addEventListener('click', () => completeTask(task.id));
    taskCardsContainer.appendChild(card);
  });

  const tableWrapper = document.getElementById('tableWrapper');
  if (tasks.length > 0) {
    tableWrapper.classList.remove('d-none');
  } else {
    tableWrapper.classList.add('d-none');
  }
}



function completeTask(taskId) {
  const task = tasks.find(t => t.id === taskId);
  tasks = tasks.filter(t => t.id !== taskId);
  renderTasks();
  showSuccessToast(task.text, 'concluída');
  playCelebrationSound();
  launchConfetti();
}


function getPriorityClass(priority) {
  switch (priority) {
    case 'Alta': return 'badge-alta';
    case 'Média': return 'badge-media';
    case 'Baixa': return 'badge-baixa';
    default: return '';
  }
}


function showAlert(message) {
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert alert-warning position-fixed top-0 start-50 translate-middle-x mt-3 shadow';
  alertDiv.style.zIndex = '9999';
  alertDiv.textContent = message;
  document.body.appendChild(alertDiv);
  setTimeout(() => alertDiv.remove(), 3000);
}


function showSuccessToast(taskText, tipo = 'adicionada') {
  const toast = document.createElement('div');
  toast.className = 'alert alert-success position-fixed bottom-0 end-0 m-3 shadow';
  toast.innerHTML = `✅ Tarefa <strong>${tipo}</strong>: ${taskText}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}


function playCelebrationSound() {
  const audio = new Audio('audio/complete.wav');
  audio.load(); 
  audio.play();
}


function launchConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

const tableWrapper = document.getElementById('tableWrapper');
if (tasks.length > 0) {
  tableWrapper.classList.remove('d-none');
} else {
  tableWrapper.classList.add('d-none');
}
