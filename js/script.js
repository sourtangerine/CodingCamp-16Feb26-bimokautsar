// Initialize the Calendar (Flatpickr)
const calendar = flatpickr("#todo-calendar", {
    enableTime: false,
    dateFormat: "Y-m-d",
    minDate: "today", // Prevent selecting past dates
});

const todoInput = document.getElementById('todo-input');
const todoCalendar = document.getElementById('todo-calendar');
const addBtn = document.getElementById('add-btn');
const todoBody = document.getElementById('todo-body');
const noTaskMsg = document.getElementById('no-task-msg');
const filterSelect = document.getElementById('filter-todo');
const deleteAllBtn = document.getElementById('delete-all-btn');

let todos = [];

// 1. Validate Input Form  and Add
addBtn.addEventListener('click', () => {
    const task = todoInput.value.trim();
    const date = todoCalendar.value;

    if (!task || !date) {
        alert("Please enter a task and pick a date from the calendar!");
        return;
    }

    const newTodo = {
        id: Date.now(),
        task: task,
        date: date,
        status: 'pending'
    };

    todos.push(newTodo);
    renderTodos();
    
    // Clear inputs
    todoInput.value = "";
    calendar.clear(); // Clear the Flatpickr instance
});

// 2. Display To-Do List [cite: 30]
function renderTodos() {
    const filterValue = filterSelect.value;
    todoBody.innerHTML = "";

    const filteredList = todos.filter(item => {
        if (filterValue === 'pending') return item.status === 'pending';
        if (filterValue === 'completed') return item.status === 'completed';
        return true;
    });

    // Handle "No task found" message [cite: 24]
    if (filteredList.length === 0) {
        noTaskMsg.classList.remove('hidden');
    } else {
        noTaskMsg.classList.add('hidden');
        filteredList.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="p-4 ${item.status === 'completed' ? 'line-through text-gray-500' : ''}">${item.task}</td>
                <td class="p-4 text-sm">${item.date}</td>
                <td class="p-4 text-center">
                    <span class="text-[10px] font-bold px-2 py-1 rounded ${item.status === 'completed' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}">
                        ${item.status.toUpperCase()}
                    </span>
                </td>
                <td class="p-4 text-right flex justify-end gap-2">
                    <button onclick="toggleStatus(${item.id})" class="text-indigo-400 hover:text-white text-xs">Done/Undo</button>
                    <button onclick="deleteTodo(${item.id})" class="text-red-500 hover:text-red-300 text-xs font-bold">Delete</button>
                </td>
            `;
            todoBody.appendChild(row);
        });
    }
}

// 3. Actions: Status, Delete, and Filter 
window.toggleStatus = (id) => {
    todos = todos.map(t => t.id === id ? { ...t, status: t.status === 'pending' ? 'completed' : 'pending' } : t);
    renderTodos();
};

window.deleteTodo = (id) => {
    todos = todos.filter(t => t.id !== id);
    renderTodos();
};

filterSelect.addEventListener('change', renderTodos);

deleteAllBtn.addEventListener('click', () => {
    if (confirm("Delete everything?")) {
        todos = [];
        renderTodos();
    }
});

// Initial call
renderTodos();