
// Task toggle functionality
function toggleTask(taskElement) {
    const checkbox = taskElement.querySelector(".task-checkbox");
    checkbox.classList.toggle("completed");

    if (checkbox.classList.contains("completed")) {
        taskElement.style.opacity = "0.6";
    } else {
        taskElement.style.opacity = "1";
    }
}

// Navigation menu functionality
// document.querySelectorAll(".nav-item").forEach((item) => {
//     item.addEventListener("click", function () {
//         // Close mobile menu when nav item is clicked
//         document.getElementById('menu-toggle').checked = false;

//         document
//             .querySelectorAll(".nav-item")
//             .forEach((nav) => nav.classList.remove("active"));
//         this.classList.add("active");
//     });
// });

// Close mobile menu when overlay is clicked
document.querySelector('.mobile-overlay').addEventListener('click', function () {
    document.getElementById('menu-toggle').checked = false;
});

// Get username from localStorage
const currentUser = localStorage.getItem('currentUser');

if (currentUser) {
    document.querySelectorAll('.displayUname').forEach(e => {
        e.textContent = currentUser
    });;
} else {
    // Optional: redirect to login if no user is logged in
    window.location.href = 'login.html';
}

// Add task functionality
document
    .querySelector(".add-task-btn")
    .addEventListener("click", function () {
        const taskTitle = prompt("Enter task title:");
        if (taskTitle) {
            const taskContainer = document.querySelector(".left-panel .card");
            const newTask = document.createElement("div");
            newTask.className = "task-item";
            newTask.onclick = () => toggleTask(newTask);

            newTask.innerHTML = `
                    <div class="task-checkbox"></div>
                    <div class="task-content">
                        <div class="task-title">${taskTitle}</div>
                        <div class="task-description">New task description...</div>
                        <div class="task-meta">
                            <span class="priority moderate">Priority: Moderate</span>
                            <span class="status not-started">Status: Not Started</span>
                            <span>Created on: ${new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                    <img src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=100&h=100&fit=crop" alt="Task" class="task-image">
                `;

            taskContainer.appendChild(newTask);
        }
    });

// Search functionality
document
    .querySelector(".search-input")
    .addEventListener("input", function (e) {
        const searchTerm = e.target.value.toLowerCase();
        const tasks = document.querySelectorAll(".task-item");

        tasks.forEach((task) => {
            const title = task
                .querySelector(".task-title")
                .textContent.toLowerCase();
            const description = task
                .querySelector(".task-description")
                .textContent.toLowerCase();

            if (
                title.includes(searchTerm) ||
                description.includes(searchTerm)
            ) {
                task.style.display = "flex";
            } else {
                task.style.display = searchTerm === "" ? "flex" : "none";
            }
        });
    });

// Initialize date
function updateDate() {
    const now = new Date();
    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const day = days[now.getDay()];
    const date = now.toLocaleDateString("en-GB");

    document.querySelector(".date-day").textContent = day;
    document.querySelector(".date-full").textContent = date;
}

// Update progress circles animation
function animateProgressCircles() {
    const circles = document.querySelectorAll(".circle");
    circles.forEach((circle) => {
        circle.style.transform = "scale(0.8)";
        setTimeout(() => {
            circle.style.transform = "scale(1)";
        }, 100);
    });
}

// Initialize
updateDate();
setTimeout(animateProgressCircles, 500);

// Smooth hover effects
document
    .querySelectorAll(".task-item, .nav-item, .invite-btn")
    .forEach((item) => {
        item.addEventListener("mouseenter", function () {
            if (!window.matchMedia("(max-width: 768px)").matches) {
                this.style.transform = "translateY(-2px)";
            }
        });

        item.addEventListener("mouseleave", function () {
            if (!window.matchMedia("(max-width: 768px)").matches) {
                this.style.transform = "translateY(0)";
            }
        });
    });

// Handle window resize
window.addEventListener('resize', function () {
    // Close mobile menu on resize to larger screen
    if (window.innerWidth > 768) {
        document.getElementById('menu-toggle').checked = false;
    }
});

function logout() {
    localStorage.removeItem('currentUser');
}




// Invite button
function openModal() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(event) {
    if (event && event.target !== event.currentTarget && !event.target.classList.contains('close-btn')) {
        return;
    }

    const overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';

    // Reset form and hide success message
    document.getElementById('emailInput').value = '';
    document.getElementById('successMessage').style.display = 'none';
}

function sendInvite(event) {
    event.preventDefault();
    const email = document.getElementById('emailInput').value;

    if (email) {
        // Show success message
        const successMsg = document.getElementById('successMessage');
        successMsg.style.display = 'block';

        // Clear the input
        document.getElementById('emailInput').value = '';

        // Hide success message after 3 seconds
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 3000);

        console.log('Invite sent to:', email);
    }
}

function copyLink() {
    const linkInput = document.getElementById('projectLink');
    linkInput.select();
    linkInput.setSelectionRange(0, 99999); // For mobile devices

    try {
        document.execCommand('copy');

        // Visual feedback
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.background = '#28a745';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);

    } catch (err) {
        console.error('Failed to copy: ', err);
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Handle member role changes
document.querySelectorAll('.member-role').forEach(select => {
    select.addEventListener('change', function () {
        console.log('Role changed for member:', this.value);

        // Visual feedback for owner role
        if (this.value === 'Owner') {
            this.classList.add('owner');
        } else {
            this.classList.remove('owner');
        }
    });
});