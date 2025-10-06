
// Global variables
let tasks = [];
let currentDate = new Date();
let currentFilter = 'all';

// Page navigation
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page-container');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    document.getElementById(pageId).classList.add('active');

    // Update navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Special handling for different pages
    if (pageId === 'calendar') {
        generateCalendar();
    } else if (pageId === 'analytics') {
        updateAnalytics();
    }
}

// Task management functions
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const categoryInput = document.getElementById('categoryInput');
    const dueDateInput = document.getElementById('dueDateInput');

    if (taskInput.value.trim() === '') {
        alert('Please enter a task!');
        return;
    }

    const task = {
        id: Date.now(),
        text: taskInput.value.trim(),
        priority: prioritySelect.value,
        category: categoryInput.value.trim() || 'General',
        dueDate: dueDateInput.value,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(task);
    saveTasks();
    renderTasks();

    // Clear inputs
    taskInput.value = '';
    categoryInput.value = '';
    dueDateInput.value = '';

    updateAnalytics();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateAnalytics();
    }
}

function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
        updateAnalytics();
    }
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        const newText = prompt('Edit task:', task.text);
        if (newText !== null && newText.trim() !== '') {
            task.text = newText.trim();
            saveTasks();
            renderTasks();
        }
    }
}

function filterTasks() {
    const filterSelect = document.getElementById('filterSelect');
    currentFilter = filterSelect.value;
    renderTasks();
}

function clearCompleted() {
    if (confirm('Are you sure you want to delete all completed tasks?')) {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
        updateAnalytics();
    }
}

function renderTasks() {
    const tasksList = document.getElementById('tasksList');
    let filteredTasks = tasks;

    // Apply filter
    switch (currentFilter) {
        case 'active':
            filteredTasks = tasks.filter(t => !t.completed);
            break;
        case 'completed':
            filteredTasks = tasks.filter(t => t.completed);
            break;
        case 'high':
        case 'medium':
        case 'low':
            filteredTasks = tasks.filter(t => t.priority === currentFilter);
            break;
    }

    if (filteredTasks.length === 0) {
        tasksList.innerHTML = '<div class="text-center text-muted py-4"><i class="fas fa-inbox fa-3x mb-3"></i><br>No tasks found</div>';
        return;
    }

    tasksList.innerHTML = filteredTasks.map(task => `
                <div class="todo-item ${task.completed ? 'completed' : ''} priority-${task.priority}">
                    <div style="display: flex; align-items: center;">
                        <input type="checkbox" class="form-check-input me-3" ${task.completed ? 'checked' : ''} 
                               onchange="toggleTask(${task.id})">
                        <div class="flex-grow-1">
                            <div class="fw-bold">${task.text}</div>
                            <small class="text-muted">
                                <span class="category-badge">${task.category}</span>
                                ${task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleDateString()}` : ''}
                            </small>
                        </div>
                    </div>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary" onclick="editTask(${task.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteTask(${task.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
}

// Calendar functions
function generateCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonth = document.getElementById('currentMonth');

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    currentMonth.textContent = currentDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let calendarHTML = '';

    // Days of week headers
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        calendarHTML += `<div class="calendar-day fw-bold text-primary">${day}</div>`;
    });

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        calendarHTML += '<div class="calendar-day"></div>';
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const tasksForDay = tasks.filter(task => task.dueDate === dateStr);
        const hasTasksClass = tasksForDay.length > 0 ? 'has-tasks' : '';

        calendarHTML += `
                    <div class="calendar-day ${hasTasksClass}">
                        <div class="fw-bold">${day}</div>
                        ${tasksForDay.slice(0, 3).map(task =>
            `<div class="task-dot" title="${task.text}"></div>`
        ).join('')}
                        ${tasksForDay.length > 3 ? `<small>+${tasksForDay.length - 3} more</small>` : ''}
                    </div>
                `;
    }

    calendarGrid.innerHTML = calendarHTML;
}

function changeMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    generateCalendar();
}

// Analytics functions
function updateAnalytics() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
    document.getElementById('pendingTasks').textContent = pendingTasks;
    document.getElementById('completionRate').textContent = completionRate + '%';

    // Update progress circle
    const progressCircle = document.getElementById('progressCircle');
    const progressText = document.getElementById('progressText');
    const circumference = 2 * Math.PI * 50;
    const progress = (completionRate / 100) * circumference;

    progressCircle.style.strokeDasharray = `${progress} ${circumference}`;
    progressText.textContent = `${completionRate}% Complete`;

    // Update priority breakdown
    const highPriority = tasks.filter(t => t.priority === 'high').length;
    const mediumPriority = tasks.filter(t => t.priority === 'medium').length;
    const lowPriority = tasks.filter(t => t.priority === 'low').length;

    document.getElementById('highPriorityCount').textContent = highPriority;
    document.getElementById('mediumPriorityCount').textContent = mediumPriority;
    document.getElementById('lowPriorityCount').textContent = lowPriority;
}

// Contact form
function submitContactForm(event) {
    event.preventDefault();
    alert('Thank you for your message! We\'ll get back to you soon.');
    event.target.reset();
}

// Local storage functions
function saveTasks() {
    const tasksData = JSON.stringify(tasks);
    // Store in memory instead of localStorage (not supported in artifacts)
    window.tasksData = tasksData;
}

function loadTasks() {
    try {
        // Load from memory instead of localStorage
        if (window.tasksData) {
            tasks = JSON.parse(window.tasksData);
        } else {
            // Demo data
            tasks = [
                {
                    id: 1,
                    text: 'Welcome to TaskMaster!',
                    priority: 'high',
                    category: 'Getting Started',
                    dueDate: new Date().toISOString().split('T')[0],
                    completed: false,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    text: 'Create your first task',
                    priority: 'medium',
                    category: 'Tutorial',
                    dueDate: '',
                    completed: false,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    text: 'Explore the calendar view',
                    priority: 'low',
                    category: 'Tutorial',
                    dueDate: '',
                    completed: true,
                    createdAt: new Date().toISOString()
                }
            ];
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
        tasks = [];
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && event.target.id === 'taskInput') {
        addTask();
    }
});

// Theme toggle (bonus feature)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    loadTasks();
    renderTasks();
    updateAnalytics();
    generateCalendar();

    // Set today's date as default for due date input
    document.getElementById('dueDateInput').valueAsDate = new Date();
});

// Responsive navigation
document.addEventListener('click', function (event) {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (event.target.classList.contains('nav-link')) {
        navbarCollapse.classList.remove('show');
    }
});

// Add some animation effects
function addTaskAnimation() {
    const tasksList = document.getElementById('tasksList');
    const newTask = tasksList.lastElementChild;
    if (newTask) {
        newTask.style.opacity = '0';
        newTask.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            newTask.style.transition = 'all 0.3s ease';
            newTask.style.opacity = '1';
            newTask.style.transform = 'translateY(0)';
        }, 10);
    }
}

// Enhanced task addition with animation
const originalAddTask = addTask;
addTask = function () {
    originalAddTask();
    setTimeout(addTaskAnimation, 100);
};

// Search functionality
function searchTasks(query) {
    const searchResults = tasks.filter(task =>
        task.text.toLowerCase().includes(query.toLowerCase()) ||
        task.category.toLowerCase().includes(query.toLowerCase())
    );

    const tasksList = document.getElementById('tasksList');
    if (searchResults.length === 0) {
        tasksList.innerHTML = '<div class="text-center text-muted py-4"><i class="fas fa-search fa-3x mb-3"></i><br>No tasks found matching your search</div>';
    } else {
        // Render search results (similar to renderTasks but with search results)
        renderSearchResults(searchResults);
    }
}

function renderSearchResults(searchResults) {
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = searchResults.map(task => `
                <div class="todo-item ${task.completed ? 'completed' : ''} priority-${task.priority}">
                    <div class="d-flex align-items-center">
                        <input type="checkbox" class="form-check-input me-3" ${task.completed ? 'checked' : ''} 
                               onchange="toggleTask(${task.id})">
                        <div class="flex-grow-1">
                            <div class="fw-bold">${task.text}</div>
                            <small class="text-muted">
                                <span class="category-badge">${task.category}</span>
                                ${task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleDateString()}` : ''}
                            </small>
                        </div>
                    </div>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary" onclick="editTask(${task.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteTask(${task.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
}

// Export/Import functionality (using download/upload)
function exportTasks() {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'taskmaster-backup.json';
    link.click();
    URL.revokeObjectURL(url);
}

function importTasks(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const importedTasks = JSON.parse(e.target.result);
                if (Array.isArray(importedTasks)) {
                    tasks = importedTasks;
                    saveTasks();
                    renderTasks();
                    updateAnalytics();
                    alert('Tasks imported successfully!');
                } else {
                    alert('Invalid file format!');
                }
            } catch (error) {
                alert('Error importing tasks!');
            }
        };
        reader.readAsText(file);
    }
}

// Add notification functionality
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed`;
    notification.style.cssText = 'top: 100px; right: 20px; z-index: 1050; min-width: 300px;';
    notification.innerHTML = `
                <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
                ${message}
            `;
    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Enhanced task operations with notifications
const originalToggleTask = toggleTask;
toggleTask = function (id) {
    const task = tasks.find(t => t.id === id);
    const wasCompleted = task.completed;
    originalToggleTask(id);

    if (!wasCompleted && task.completed) {
        showNotification('Task completed! 🎉', 'success');
    } else if (wasCompleted && !task.completed) {
        showNotification('Task marked as pending', 'info');
    }
};

// Add productivity tips
const productivityTips = [
    "Break large tasks into smaller, manageable chunks",
    "Set specific deadlines to stay motivated",
    "Use the Pomodoro Technique: 25 minutes work, 5 minutes break",
    "Prioritize your most important tasks first",
    "Review your tasks daily to stay on track",
    "Celebrate small wins to maintain motivation",
    "Eliminate distractions when working on important tasks",
    "Use categories to organize related tasks together"
];

function showRandomTip() {
    const tip = productivityTips[Math.floor(Math.random() * productivityTips.length)];
    showNotification(`💡 Tip: ${tip}`, 'info');
}

// Show a tip every 5 minutes (300000 ms)
setInterval(showRandomTip, 300000);
