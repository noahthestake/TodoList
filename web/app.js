/**
 * Instructor key — Week 6 Class 2 (complete).
 * Objects, arrays, LocalStorage as source of truth, toggle + delete.
 */

const STORAGE_KEY = "isit300-todos";

const form = document.querySelector("#todo-form");
const titleInput = document.querySelector("#todo-title");
const notesInput = document.querySelector("#todo-notes");
const dueInput = document.querySelector("#todo-due");
const list = document.querySelector("#todo-list");
const emptyState = document.querySelector("#empty-state");
const countEl = document.querySelector("#todo-count");
const sortButton = document.querySelector("#todo-sort-button");

let todos = [];
let todoTaskSort = "asc";

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  console.log("Saved", todos.length, "todos to LocalStorage.");
}

function loadTodos() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Could not parse stored todos:", error);
    return [];
  }
}

function updateListMeta() {
  const n = todos.length;
  emptyState.hidden = n > 0;
  countEl.textContent = n === 1 ? "1 item" : `${n} items`;
}

function renderTodos() {
  list.innerHTML = "";

  todos.forEach(function (todo) {
    const li = document.createElement("li");
    li.className = "todo-item";
    if (todo.completed) {
      li.classList.add("is-complete");
    }
    li.dataset.id = todo.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-check";
    checkbox.checked = Boolean(todo.completed);
    checkbox.setAttribute("aria-label", `Mark "${todo.title}" complete`);
    checkbox.addEventListener("change", function () {
      toggleTodo(todo.id);
    });

    const body = document.createElement("div");
    body.className = "todo-body";

    const titleEl = document.createElement("p");
    titleEl.className = "todo-title";
    titleEl.textContent = todo.title;
    body.appendChild(titleEl);

    if (todo.notes) {
      const notesEl = document.createElement("p");
      notesEl.className = "todo-notes";
      notesEl.textContent = todo.notes;
      body.appendChild(notesEl);
    }

    if (todo.dueDate) {
      const meta = document.createElement("p");
      meta.className = "todo-meta";
      meta.textContent = `Due ${todo.dueDate}`;
      body.appendChild(meta);
    }

    const actions = document.createElement("div");
    actions.className = "todo-actions";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn icon";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function () {
      deleteTodo(todo.id);
    });
    actions.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(body);
    li.appendChild(actions);
    list.appendChild(li);
  });

  updateListMeta();
}

function createTodo(title, notes, dueDate) {
  const todo = {
    id: String(Date.now()),
    title: title,
    notes: notes || "",
    dueDate: dueDate || "",
    completed: false,
    createdAt: new Date().toISOString(),
  };
  todos.push(todo);
  sortTodos();
  saveTodos();
  renderTodos();
  console.log("Created todo object:", todo);
}

function toggleTodo(id) {
  const todo = todos.find(function (item) {
    return item.id === id;
  });
  if (!todo) {
    return;
  }
  todo.completed = !todo.completed;
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter(function (item) {
    return item.id !== id;
  });
  sortTodos();
  saveTodos();
  renderTodos();
}

function sortTodos() {
  try {
      if (todoTaskSort === "asc") {
      todos.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      } else {
      todos.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
      }
      console.log(todos);
  } catch(error) {
      console.error("Error sorting todos:", error);
      return false;
  }
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  if (!title) {
    console.warn("Title is required.");
    titleInput.focus();
    return;
  }

  createTodo(title, notesInput.value.trim(), dueInput.value);
  form.reset();
  titleInput.focus();
});

sortButton.addEventListener("click", function(event){
  event.preventDefault();
  if(todoTaskSort === "asc") {
    sortButton.textContent = "DESCENDING";
    todoTaskSort = "desc";
  } else {
    sortButton.textContent = "ASCENDING";
    todoTaskSort = "asc";
  }
  sortTodos();
  saveTodos(todos);
  renderTodos();
  console.log("Sort button clicked");
});

todos = loadTodos();
renderTodos();
