const mensagem = document.getElementById("empty-message");
const input = document.getElementById("task-input");
const tasklist = document.getElementById("task-list");
const addbutton = document.getElementById("add-button");

function atualizarContador() {
    const tarefas = tasklist.querySelectorAll(".task-item").length;
    const contador = document.getElementById("task-counter");

    if (contador) {
        contador.textContent =
     tarefas === 1
    ? "1 tarefa"
    : tarefas + " tarefas";
    }

    // mostra/esconde a mensagem baseada no total real
    if (tarefas === 0) {
        mensagem.style.display = "block";
    } else {
        mensagem.style.display = "none";
    }

}
// filtro de tarefas pendentes é completas
const filterAll = document.getElementById("filter-all");
const filterPending = document.getElementById("filter-pending");
const filterCompleted = document.getElementById("filter-completed");
const clearCompleted = document.getElementById("clear-completed");
const clearAll = document.getElementById("clear-all");

filterAll.addEventListener("click", function() {
    tasklist.querySelectorAll(".task-item").forEach(function(tarefa) {
        tarefa.style.display = "flex";
    });
});
filterPending.addEventListener("click", function() {
    tasklist.querySelectorAll(".task-item").forEach(function(tarefa) {
        if (tarefa.classList.contains("completed")) {
            tarefa.style.display = "none";
        } else {
            tarefa.style.display = "flex";
        }
    });
});
filterCompleted.addEventListener("click", function() {
    tasklist.querySelectorAll(".task-item").forEach(function(tarefa) {
        if (tarefa.classList.contains("completed")) {
            tarefa.style.display = "flex";
        } else {
            tarefa.style.display = "none";
        }
    });
});
clearCompleted.addEventListener("click", function() {
    if (confirm("Tem certeza que deseja limpar as tarefas concluídas?")) {
    tasklist.querySelectorAll(".task-item.completed").forEach(function(tarefa) {  
        tarefa.remove();
        salvarTarefas();
        atualizarContador();

    });
    }

    salvarTarefas();
    atualizarContador();
});

clearAll.addEventListener("click", function() {
    if (confirm("Tem certeza que deseja limpar todas as tarefas?")) {
        tasklist.querySelectorAll(".task-item").forEach(function(tarefa) {
            tarefa.remove();
        });
        salvarTarefas();
        atualizarContador();
    }
});


const themeButton =
document.getElementById("theme-toggle");

themeButton.addEventListener("click", function() {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {

        localStorage.setItem("tema", "dark");

    } else {

        localStorage.setItem("tema", "light");

    }

});

function ativarFiltro(botao) {
    document.querySelectorAll(".filter-button").forEach(function(btn) {
        btn.classList.remove("active-filter");
    });
    botao.classList.add("active-filter");
}

filterAll.addEventListener("click", function() {
    ativarFiltro(filterAll);
});
filterPending.addEventListener("click", function() {
    ativarFiltro(filterPending);
});
filterCompleted.addEventListener("click", function() {
    ativarFiltro(filterCompleted);
});

function criarTarefa(taskText) {
    const tarefa = document.createElement("div");
    tarefa.classList.add("task-item");
    tarefa.innerHTML = `
        <div class="task-left">
            <input type="checkbox" class="checkbox">
            <span class="task-text">${taskText}</span>
        </div>
        <button class="delete-button" aria-label="deletar">
          <i class="fa-solid fa-trash"></i>
         </button>
    `;


    const deleteButton = tarefa.querySelector(".delete-button");
    deleteButton.addEventListener("click", function(event) {
        event.stopPropagation();
        tarefa.classList.add("deleting");
        deleteButton.classList.add("deleting");

        setTimeout(() => {
            tarefa.remove();
            mostrarToast("Tarefa removida!");
            salvarTarefas();
            atualizarContador();
        }, 300);
    });

    const checkbox = tarefa.querySelector(".checkbox");
    checkbox.addEventListener("change", function() {
        if (checkbox.checked) {
            tarefa.classList.add("completed");
        } else {
            tarefa.classList.remove("completed");
        }
        mostrarToast("Tarefa concluída!");
        salvarTarefas();
        atualizarContador();
    });

    const textoTarefa = tarefa.querySelector(".task-text");
    textoTarefa.addEventListener("dblclick", function() {
        const inputEdit = document.createElement("input");
        inputEdit.type = "text";
        inputEdit.value = textoTarefa.textContent;
        inputEdit.classList.add("edit-input");

        textoTarefa.replaceWith(inputEdit);
        inputEdit.focus();

        // ENTER
    inputEdit.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
     const novoTexto = inputEdit.value.trim();

        if (novoTexto !== "") {
        textoTarefa.textContent = novoTexto;
}
        inputEdit.replaceWith(textoTarefa);
        salvarTarefas();
    }
});

        // CLICK FORA
    inputEdit.addEventListener("blur", function() {
    const novoTexto = inputEdit.value.trim();

    if (novoTexto !== "") {
    textoTarefa.textContent = novoTexto;
}
        inputEdit.replaceWith(textoTarefa);
        salvarTarefas();
    });
});

    return tarefa;
}

addbutton.addEventListener("click", function() {
    const taskText = input.value.trim();
    if (!taskText) return;

    const tarefa = criarTarefa(taskText);
    tasklist.appendChild(tarefa);
    mostrarToast("Tarefa adicionada!");
    salvarTarefas();
    input.value = "";
    atualizarContador();
});

input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addbutton.click();
    }
});


// estado inicial
atualizarContador();

function salvarTarefas() {
    const pendentes =
tasklist.querySelectorAll(".task-item:not(.completed)").length;

const concluidasTexto =
tasklist.querySelectorAll(".task-item.completed").length;

document.getElementById("task-status").textContent =
`${pendentes} pendentes • ${concluidasTexto} concluídas`;
    

    const tarefas = [];
    tasklist.querySelectorAll(".task-item").forEach(function(tarefa) {

        const texto =
        tarefa.querySelector(".task-text").textContent;

        const concluida =
        tarefa.classList.contains("completed");

        tarefas.push({

            texto: texto,

            concluida: concluida

        });

    });

    localStorage.setItem("tarefas", JSON.stringify(tarefas));



const concluidas =
tasklist.querySelectorAll(".task-item.completed").length;

document.getElementById("task-status").textContent =
`${pendentes} pendentes • ${concluidas} concluídas`;

}
const tarefasSalvas = JSON.parse(localStorage.getItem("tarefas")) || [];

tarefasSalvas.forEach(function(tarefaSalva){

    const tarefa =
    criarTarefa(tarefaSalva.texto);

    if (tarefaSalva.concluida) {

        tarefa.classList.add("completed");

        tarefa.querySelector(".checkbox").checked = true;

    }

    tasklist.appendChild(tarefa);

});
atualizarContador();
salvarTarefas();
// função para mostrar toast
function mostrarToast(mensagem) {

    const toast = document.getElementById("toast");

    toast.textContent = mensagem;

    toast.classList.add("show");

    setTimeout(function() {
        toast.classList.remove("show");
    }, 2000);
}
const temaSalvo = localStorage.getItem("tema");

if (temaSalvo === "dark") {

    document.body.classList.add("dark-mode");

}

atualizarContador();
salvarTarefas();
