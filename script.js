/* ==========================================================================
   TaskJourney Application Logic & State Management
   ========================================================================== */

// 1. Initial State & Data Definition
let tasks = [];
let currentFilter = 'all';
let searchQuery = '';
let categoryFilter = 'all';
let priorityFilter = 'all';
let sortOrder = 'date-asc';
let statusFilter = 'all';

// Settings state
let currentUsername = 'Explorer';
let currentTheme = 'indigo-violet';

// Calendar current state
let calendarDate = new Date();

// High-quality wisdom quotes list
const MOTIVATION_QUOTES = [
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "Productivity is being able to do things that you were never able to do before.", author: "Franz Kafka" },
  { text: "It is not that we have a short time to live, but that we waste a lot of it.", author: "Seneca" },
  { text: "Concentrate all your thoughts upon the work at hand. The sun's rays do not burn until brought to a focus.", author: "Alexander Graham Bell" },
  { text: "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.", author: "Stephen King" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Continuous improvement is better than delayed perfection.", author: "Mark Twain" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "The path to success is to take massive, determined action.", author: "Tony Robbins" }
];

// 2. Helper Utilities
const getLocalDateString = (dateObj = new Date()) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getLocalTimeString = (dateObj = new Date()) => {
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Check if a task is overdue (pending and deadline date/time is past)
const isTaskOverdue = (task) => {
  if (task.completed) return false;
  const now = new Date();
  const taskDeadline = new Date(`${task.date}T${task.time || '00:00'}`);
  return taskDeadline < now;
};

// 3. Mock Data Loader (Hydrates empty state on first run)
const getMockTasks = () => {
  const today = getLocalDateString();
  
  const yesterdayObj = new Date();
  yesterdayObj.setDate(yesterdayObj.getDate() - 1);
  const yesterday = getLocalDateString(yesterdayObj);

  const tomorrowObj = new Date();
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrow = getLocalDateString(tomorrowObj);

  const dayAfterObj = new Date();
  dayAfterObj.setDate(dayAfterObj.getDate() + 2);
  const dayAfter = getLocalDateString(dayAfterObj);

  return [
    {
      id: "mock-1",
      name: "Optimise Portfolio Resume for ATS",
      description: "Tailor keyword density matching machine learning, software engineering, and fullstack placement descriptions. Keep formatting clean with no columns or tables.",
      date: yesterday,
      time: "10:00",
      category: "Work",
      priority: "High",
      duration: "1.5 hours",
      reminder: true,
      completed: true
    },
    {
      id: "mock-2",
      name: "Develop TaskJourney Interactive Dashboard",
      description: "Create the vertical Journey Timeline task manager workspace. Ensure glassmorphism theme, dynamic metrics, and responsive sidebar navigation features are complete.",
      date: today,
      time: "14:00",
      category: "Work",
      priority: "Critical",
      duration: "3 hours",
      reminder: true,
      completed: false
    },
    {
      id: "mock-3",
      name: "Solve 3 Leetcode Trees & Graphs Problems",
      description: "Complete Graph traversal algorithms: BFS/DFS, and binary search tree deletion logic reviews.",
      date: today,
      time: "18:30",
      category: "Personal",
      priority: "Medium",
      duration: "1 hour",
      reminder: false,
      completed: false
    },
    {
      id: "mock-4",
      name: "Practice Mock Behavioral Interview Session",
      description: "Run through standard STAR technique stories focusing on resolving project deadlines, team conflicts, and key technical challenges with peers.",
      date: tomorrow,
      time: "11:00",
      category: "Work",
      priority: "High",
      duration: "45 mins",
      reminder: true,
      completed: false
    },
    {
      id: "mock-5",
      name: "Review Monthly Placement Application Status",
      description: "Check response status from corporate dashboards, follow up on pending hiring manager emails.",
      date: dayAfter,
      time: "16:00",
      category: "Finance",
      priority: "Low",
      duration: "30 mins",
      reminder: false,
      completed: false
    }
  ];
};

// 4. Local Storage Integrations
const loadData = () => {
  const storedTasks = localStorage.getItem('tj_tasks');
  const storedUsername = localStorage.getItem('tj_username');
  const storedTheme = localStorage.getItem('tj_theme');

  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
  } else {
    tasks = getMockTasks();
    saveData();
  }

  if (storedUsername) {
    currentUsername = storedUsername;
  }
  if (storedTheme) {
    currentTheme = storedTheme;
  }
};

const saveData = () => {
  localStorage.setItem('tj_tasks', JSON.stringify(tasks));
  localStorage.setItem('tj_username', currentUsername);
  localStorage.setItem('tj_theme', currentTheme);
};

// 5. Toast Feedback Component
const showToast = (message, type = 'success') => {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast glass-panel ${type}`;
  
  toast.innerHTML = `
    <span>${message}</span>
    <button class="toast-close">✕</button>
  `;

  container.appendChild(toast);

  // Auto remove toast
  const removeTimeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);

  // Close button click listener
  toast.querySelector('.toast-close').addEventListener('click', () => {
    clearTimeout(removeTimeout);
    toast.remove();
  });
};

// SVG Definitions Injected on load to avoid broken images
const injectSvgGradients = () => {
  if (document.getElementById('svg-gradient-defs')) return;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("id", "svg-gradient-defs");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.style.position = "absolute";
  svg.style.zIndex = "-10";
  svg.innerHTML = `
    <defs>
      <linearGradient id="progress-grad-color" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="var(--color-primary)" />
        <stop offset="100%" stop-color="var(--color-accent)" />
      </linearGradient>
    </defs>
  `;
  document.body.appendChild(svg);
};

// 6. Primary Component Renders
const renderDashboard = () => {
  injectSvgGradients();
  updateGreeting();
  updateMetrics();
  updateProgressCircle();
  renderTimeline();
  renderCalendar();
  updateNextDeadline();
  renderReminders();
};

// Display User Greeting & Date
const updateGreeting = () => {
  const greetingEl = document.getElementById('greeting-title');
  const time = new Date().getHours();
  let greet = "Hello";
  if (time < 12) greet = "Good Morning";
  else if (time < 18) greet = "Good Afternoon";
  else greet = "Good Evening";

  greetingEl.textContent = `${greet}, ${currentUsername}!`;

  // Standard Header Date
  const dateEl = document.getElementById('today-date-string');
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  dateEl.textContent = new Date().toLocaleDateString('en-GB', options);
};

// Update KPI Stats Cards
const updateMetrics = () => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const overdue = tasks.filter(t => isTaskOverdue(t)).length;

  document.getElementById('count-total').textContent = total;
  document.getElementById('count-completed').textContent = completed;
  document.getElementById('count-pending').textContent = pending;
  
  const overdueEl = document.getElementById('count-overdue');
  overdueEl.textContent = overdue;
  if (overdue > 0) {
    overdueEl.closest('.metric-card').classList.add('pulse-danger');
  } else {
    overdueEl.closest('.metric-card').classList.remove('pulse-danger');
  }
};

// Circular Today Progress ring updater
const updateProgressCircle = () => {
  const today = getLocalDateString();
  const todayTasks = tasks.filter(t => t.date === today);
  const ring = document.getElementById('progress-indicator-ring');
  const percentageVal = document.getElementById('progress-percentage-val');
  const msgEl = document.getElementById('progress-msg');

  if (todayTasks.length === 0) {
    ring.setAttribute('stroke-dasharray', '0, 100');
    percentageVal.textContent = '0%';
    msgEl.textContent = "No milestones today!";
    return;
  }

  const completedToday = todayTasks.filter(t => t.completed).length;
  const percentage = Math.round((completedToday / todayTasks.length) * 100);

  // Circumference is exactly 100
  ring.setAttribute('stroke-dasharray', `${percentage}, 100`);
  percentageVal.textContent = `${percentage}%`;

  // Dynamic encouragement notes
  if (percentage === 0) {
    msgEl.textContent = "Let's log your first check!";
  } else if (percentage < 40) {
    msgEl.textContent = "Off to a solid start!";
  } else if (percentage < 70) {
    msgEl.textContent = "Keep going, doing great!";
  } else if (percentage < 100) {
    msgEl.textContent = "Almost there! Finish strong!";
  } else {
    msgEl.textContent = "Today's journey complete! 🎉";
  }
};

// Next Deadline countdown Widget updater
const updateNextDeadline = () => {
  const now = new Date();
  
  // Filter for pending future milestones
  const upcomingPending = tasks.filter(t => !t.completed).map(t => {
    return {
      ...t,
      deadlineObj: new Date(`${t.date}T${t.time || '00:00'}`)
    };
  }).filter(t => t.deadlineObj >= now)
    .sort((a, b) => a.deadlineObj - b.deadlineObj);

  const nameEl = document.getElementById('deadline-task-name');
  const timeEl = document.getElementById('deadline-task-time');
  const countdownEl = document.getElementById('deadline-countdown-val');
  const badgeEl = document.getElementById('deadline-countdown');

  if (upcomingPending.length === 0) {
    nameEl.textContent = "No upcoming deadlines";
    timeEl.textContent = "-";
    countdownEl.textContent = "N/A";
    badgeEl.style.background = 'rgba(0,0,0,0.04)';
    badgeEl.style.color = 'var(--text-muted)';
    return;
  }

  const nextTask = upcomingPending[0];
  nameEl.textContent = nextTask.name;

  // Format date
  const dateOpt = { day: 'numeric', month: 'short' };
  const taskDateStr = new Date(nextTask.date).toLocaleDateString('en-GB', dateOpt);
  timeEl.textContent = `${taskDateStr} @ ${nextTask.time}`;

  // Time diff math
  const diffMs = nextTask.deadlineObj - now;
  const diffHrs = diffMs / (1000 * 60 * 60);

  badgeEl.style.background = 'var(--color-primary-glow)';
  badgeEl.style.color = 'var(--color-primary)';

  if (diffHrs < 1) {
    const diffMins = Math.round(diffMs / (1000 * 60));
    countdownEl.textContent = `${diffMins}m left`;
    badgeEl.style.background = 'rgba(239, 68, 68, 0.1)';
    badgeEl.style.color = '#ef4444';
  } else if (diffHrs < 24) {
    countdownEl.textContent = `${Math.floor(diffHrs)}h left`;
  } else {
    const diffDays = Math.round(diffHrs / 24);
    countdownEl.textContent = `${diffDays}d left`;
  }
};

// Sidebar Reminders list widget builder
const renderReminders = () => {
  const remindersBox = document.getElementById('reminders-list-box');
  remindersBox.innerHTML = '';

  // Get active reminder-enabled pending tasks (sorted by date)
  const activeReminders = tasks.filter(t => !t.completed && t.reminder)
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
    .slice(0, 3); // show top 3

  if (activeReminders.length === 0) {
    remindersBox.innerHTML = `
      <div class="empty-list-note">
        <p style="font-size: 0.78rem; color: var(--text-light); text-align: center; font-style: italic;">No active alert reminders set.</p>
      </div>
    `;
    return;
  }

  activeReminders.forEach(task => {
    const div = document.createElement('div');
    div.className = 'reminder-item';

    // Format date string for summary display
    const dateFormatted = new Date(task.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

    div.innerHTML = `
      <div class="reminder-info">
        <p class="reminder-title">${task.name}</p>
        <span class="reminder-time">${dateFormatted} • ${task.time}</span>
      </div>
      <div class="reminder-bell-icon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
      </div>
    `;
    remindersBox.appendChild(div);
  });
};

// 7. Journey Timeline Rendering Core
const renderTimeline = () => {
  const target = document.getElementById('timeline-milestones');
  const emptyState = document.getElementById('timeline-empty');
  target.innerHTML = '';

  const todayStr = getLocalDateString();

  // Apply filters and searches
  let filtered = tasks.filter(task => {
    // 1. Sidebar Nav filter
    if (currentFilter === 'today') {
      return task.date === todayStr;
    } else if (currentFilter === 'important') {
      return task.priority === 'High' || task.priority === 'Critical';
    } else if (currentFilter === 'upcoming') {
      return task.date > todayStr;
    } else if (currentFilter === 'completed') {
      return task.completed === true;
    }

    return true; // "all" dashboard show all
  });

  // 2. Toolbar filter: Category
  if (categoryFilter !== 'all') {
    filtered = filtered.filter(t => t.category === categoryFilter);
  }

  // 3. Toolbar filter: Priority
  if (priorityFilter !== 'all') {
    filtered = filtered.filter(t => t.priority === priorityFilter);
  }

  // Toolbar filter: Status
  if (statusFilter !== 'all') {
    const isComp = statusFilter === 'completed';
    filtered = filtered.filter(t => t.completed === isComp);
  }

  // 4. Toolbar search match
  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(t => 
      t.name.toLowerCase().includes(q) || 
      (t.description && t.description.toLowerCase().includes(q))
    );
  }

  // 5. Apply sorting logic
  filtered.sort((a, b) => {
    if (sortOrder === 'date-asc') {
      return new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`);
    } else if (sortOrder === 'date-desc') {
      return new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`);
    } else if (sortOrder === 'time-asc') {
      return a.time.localeCompare(b.time);
    } else if (sortOrder === 'priority-desc') {
      const weights = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      return weights[b.priority] - weights[a.priority];
    }
    return 0;
  });

  // Toggle empty state visibility
  if (filtered.length === 0) {
    emptyState.style.display = 'flex';
    return;
  } else {
    emptyState.style.display = 'none';
  }

  // Render cards
  filtered.forEach(task => {
    const item = document.createElement('div');
    item.className = `timeline-item ${task.completed ? 'completed' : ''}`;
    item.setAttribute('data-id', task.id);

    // Dynamic icon for milestone node based on status
    const nodeIcon = task.completed 
      ? `<svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>` 
      : '';

    // Date/Time formatting for humans
    const taskDateObj = new Date(task.date);
    const dateFormatted = taskDateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const isToday = task.date === todayStr;

    item.innerHTML = `
      <div class="timeline-node-box">
        <div class="timeline-node" style="${task.completed ? 'display:flex;align-items:center;justify-content:center;' : ''}">
          ${nodeIcon}
        </div>
      </div>
      <div class="timeline-arm"></div>
      
      <div class="task-card glass-panel">
        
        <div class="task-card-header">
          <!-- Checkbox container -->
          <div class="task-checkbox-wrapper">
            <input type="checkbox" class="task-checkbox-input" ${task.completed ? 'checked' : ''} aria-label="Mark task as complete">
            <div class="task-checkbox-custom">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
          </div>

          <!-- Text block -->
          <div class="task-details-box">
            <div class="task-text-box">
              <h3 class="task-title">${task.name}</h3>
              <p class="task-desc">${task.description || 'No additional details provided.'}</p>
            </div>
            
            <!-- Metadata badges -->
            <div class="task-meta-row">
              <span class="badge category-${task.category.toLowerCase()}">
                ${task.category === 'Work' ? '💼' : task.category === 'Personal' ? '🏠' : task.category === 'Health' ? '🍏' : task.category === 'Finance' ? '💰' : '🏷️'} 
                ${task.category}
              </span>
              <span class="badge priority-${task.priority.toLowerCase()}">${task.priority} Priority</span>
              
              <span class="badge badge-info">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:2px"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                ${isToday ? 'Today' : dateFormatted}
              </span>

              <span class="badge badge-info">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:2px"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                ${task.time}
              </span>

              ${task.duration ? `
              <span class="badge badge-info">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:2px"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 15 15"></polyline></svg>
                ${task.duration}
              </span>` : ''}

              ${task.reminder ? `
              <span class="badge badge-info" style="color: var(--color-primary)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right:2px"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                Alert Set
              </span>` : ''}
            </div>

            <!-- Action group buttons -->
            <div class="task-actions">
              <button class="action-btn edit-btn" aria-label="Edit Milestone">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button class="action-btn delete-btn delete" aria-label="Delete Milestone">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
              <button class="action-btn expand-btn" aria-label="Expand details">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
            </div>

          </div>
        </div>

        <!-- Expanded details block -->
        <div class="task-expanded-details">
          <p class="expanded-label">Milestone Details & Objectives:</p>
          <p class="expanded-text">${task.description || 'No additional checklist details provided for this journey milestone.'}</p>
        </div>

      </div>
    `;

    // Connect checkbox dynamic event
    const cb = item.querySelector('.task-checkbox-input');
    cb.addEventListener('change', () => {
      toggleTaskCompleted(task.id);
    });

    // Expand collapse event
    const exp = item.querySelector('.expand-btn');
    const card = item.querySelector('.task-card');
    exp.addEventListener('click', (e) => {
      e.stopPropagation();
      card.classList.toggle('expanded');
    });

    // Delete event listener
    const delBtn = item.querySelector('.delete-btn');
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteTask(task.id);
    });

    // Edit event listener
    const editBtn = item.querySelector('.edit-btn');
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEditModal(task);
    });

    target.appendChild(item);
  });
};

// Toggle Completion Status Action
const toggleTaskCompleted = (id) => {
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex !== -1) {
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    
    // Add minor timeline element class triggers
    const el = document.querySelector(`.timeline-item[data-id="${id}"]`);
    if (el) {
      if (tasks[taskIndex].completed) {
        el.classList.add('completed');
        showToast(`Milestone completed! Keep going!`, 'success');
      } else {
        el.classList.remove('completed');
        showToast(`Milestone marked as pending.`, 'info');
      }
    }
    
    saveData();
    updateMetrics();
    updateProgressCircle();
    updateNextDeadline();
    renderReminders();
    renderCalendar();

    // Rerender timeline to handle filtered active navigation view updates
    setTimeout(() => {
      renderTimeline();
    }, 400);
  }
};

// Delete Task milestone Action
const deleteTask = (id) => {
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex !== -1) {
    const deletedName = tasks[taskIndex].name;
    tasks.splice(taskIndex, 1);
    saveData();
    renderDashboard();
    showToast(`Deleted "${deletedName}" milestone.`, 'warning');
  }
};

// 8. Dynamic Mini Calendar Renderer
const renderCalendar = () => {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  // Set month title
  document.getElementById('calendar-month-year').textContent = `${monthNames[month]} ${year}`;

  const daysGrid = document.getElementById('calendar-days-grid');
  daysGrid.innerHTML = '';

  const firstDayIndex = new Date(year, month, 1).getDay(); // Sunday is 0
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  // 1. Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayVal = prevMonthTotalDays - i;
    const cell = document.createElement('span');
    cell.className = 'calendar-day-cell other-month';
    cell.textContent = dayVal;
    daysGrid.appendChild(cell);
  }

  // Today marker date
  const todayObj = new Date();
  const todayDate = todayObj.getDate();
  const todayMonth = todayObj.getMonth();
  const todayYear = todayObj.getFullYear();

  // 2. Render actual current month days
  for (let day = 1; day <= totalDays; day++) {
    const cell = document.createElement('span');
    cell.className = 'calendar-day-cell';
    cell.textContent = day;

    const cellDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // Mark current day in calendar
    if (day === todayDate && month === todayMonth && year === todayYear) {
      cell.classList.add('today');
    }

    // Task indicators logic - place small dot if tasks exist on this date string
    const hasTasks = tasks.some(t => t.date === cellDateStr);
    if (hasTasks) {
      const dot = document.createElement('span');
      dot.className = 'calendar-task-dot';
      cell.appendChild(dot);
    }

    daysGrid.appendChild(cell);
  }

  // 3. Next month leading days
  const gridCellsFilled = firstDayIndex + totalDays;
  const remainingCells = 42 - gridCellsFilled; // 6 rows grid
  for (let day = 1; day <= remainingCells; day++) {
    const cell = document.createElement('span');
    cell.className = 'calendar-day-cell other-month';
    cell.textContent = day;
    daysGrid.appendChild(cell);
  }
};

// Navigation months logic
const changeCalendarMonth = (direction) => {
  if (direction === 'prev') {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
  } else {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
  }
  renderCalendar();
};

// 9. Motivation quote generator
const shuffleQuote = () => {
  const quoteEl = document.getElementById('motivation-quote');
  const authorEl = document.getElementById('motivation-author');

  const randomIdx = Math.floor(Math.random() * MOTIVATION_QUOTES.length);
  const q = MOTIVATION_QUOTES[randomIdx];

  quoteEl.textContent = q.text;
  authorEl.textContent = `— ${q.author}`;
};

// 10. Form & Modal Controls
const openCreateModal = () => {
  const modal = document.getElementById('task-modal');
  const form = document.getElementById('task-form');
  
  form.reset();
  document.getElementById('task-edit-id').value = '';
  document.getElementById('modal-title').textContent = 'New Journey Milestone';
  document.getElementById('modal-submit-btn').textContent = 'Add to Journey';

  // Set default values
  document.getElementById('task-date').value = getLocalDateString();
  document.getElementById('task-time').value = "09:00";

  // Clear validation styling errors
  document.querySelectorAll('.form-group').forEach(fg => fg.classList.remove('has-error'));

  modal.classList.add('open');
};

const openEditModal = (task) => {
  const modal = document.getElementById('task-modal');
  const form = document.getElementById('task-form');
  
  form.reset();

  document.getElementById('task-edit-id').value = task.id;
  document.getElementById('modal-title').textContent = 'Edit Journey Milestone';
  document.getElementById('modal-submit-btn').textContent = 'Save Changes';

  // Populating form values
  document.getElementById('task-name').value = task.name;
  document.getElementById('task-description').value = task.description || '';
  document.getElementById('task-date').value = task.date;
  document.getElementById('task-time').value = task.time;
  document.getElementById('task-category').value = task.category;
  document.getElementById('task-priority').value = task.priority;
  document.getElementById('task-duration').value = task.duration || '';
  document.getElementById('task-reminder').checked = task.reminder;

  // Clear validation errors
  document.querySelectorAll('.form-group').forEach(fg => fg.classList.remove('has-error'));

  modal.classList.add('open');
};

const closeModal = () => {
  document.getElementById('task-modal').classList.remove('open');
};

// Save form details
const handleFormSubmit = (e) => {
  e.preventDefault();
  
  const titleInput = document.getElementById('task-name');
  const dateInput = document.getElementById('task-date');
  const timeInput = document.getElementById('task-time');

  let isValid = true;

  // 1. Validation checks
  if (titleInput.value.trim() === '') {
    titleInput.closest('.form-group').classList.add('has-error');
    isValid = false;
  } else {
    titleInput.closest('.form-group').classList.remove('has-error');
  }

  if (dateInput.value === '') {
    dateInput.closest('.form-group').classList.add('has-error');
    isValid = false;
  } else {
    dateInput.closest('.form-group').classList.remove('has-error');
  }

  if (timeInput.value === '') {
    timeInput.closest('.form-group').classList.add('has-error');
    isValid = false;
  } else {
    timeInput.closest('.form-group').classList.remove('has-error');
  }

  if (!isValid) return;

  // Form values bundle
  const editId = document.getElementById('task-edit-id').value;
  const taskName = titleInput.value.trim();
  const taskDesc = document.getElementById('task-description').value.trim();
  const taskDate = dateInput.value;
  const taskTime = timeInput.value;
  const taskCategory = document.getElementById('task-category').value;
  const taskPriority = document.getElementById('task-priority').value;
  const taskDuration = document.getElementById('task-duration').value.trim();
  const taskReminder = document.getElementById('task-reminder').checked;

  if (editId) {
    // Edit existing milestone
    const idx = tasks.findIndex(t => t.id === editId);
    if (idx !== -1) {
      tasks[idx] = {
        ...tasks[idx],
        name: taskName,
        description: taskDesc,
        date: taskDate,
        time: taskTime,
        category: taskCategory,
        priority: taskPriority,
        duration: taskDuration,
        reminder: taskReminder
      };
      showToast(`Milestone updated successfully!`, 'success');
    }
  } else {
    // Add new milestone
    const newTask = {
      id: `task-${Date.now()}`,
      name: taskName,
      description: taskDesc,
      date: taskDate,
      time: taskTime,
      category: taskCategory,
      priority: taskPriority,
      duration: taskDuration,
      reminder: taskReminder,
      completed: false
    };
    tasks.push(newTask);
    showToast(`New milestone added to your journey!`, 'success');
  }

  saveData();
  closeModal();
  renderDashboard();
};

// 11. Settings Panels Logic
const applyThemeClass = (themeName) => {
  document.body.className = '';
  if (themeName !== 'indigo-violet') {
    document.body.classList.add(`theme-${themeName}`);
  }
};

const handleSaveSettings = () => {
  const usernameInput = document.getElementById('settings-username');
  const themeInput = document.getElementById('settings-theme');

  if (usernameInput.value.trim() !== '') {
    currentUsername = usernameInput.value.trim();
  }
  currentTheme = themeInput.value;

  applyThemeClass(currentTheme);
  saveData();
  updateGreeting();
  showToast('Settings saved successfully.', 'success');
};

const exportDataJSON = () => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
  const dlAnchorElem = document.createElement('a');
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", `TaskJourney_backup_${getLocalDateString()}.json`);
  dlAnchorElem.click();
  showToast('Task database exported.', 'info');
};

const resetApplicationData = () => {
  if (confirm('Are you sure you want to reset all TaskJourney milestones and restore defaults? This cannot be undone.')) {
    localStorage.clear();
    loadData();
    applyThemeClass(currentTheme);

    // Update settings inputs to default
    document.getElementById('settings-username').value = currentUsername;
    document.getElementById('settings-theme').value = currentTheme;

    renderDashboard();
    showToast('Application database restored to defaults.', 'warning');
  }
};

// 12. App Navigation Router & Sidebar controllers
const handleNavSwitch = (targetFilter) => {
  // Toggle sections
  const timelineSection = document.getElementById('timeline-view');
  const settingsSection = document.getElementById('settings-view');
  const banner = document.getElementById('filter-banner');
  const bannerText = document.getElementById('filter-banner-text');

  // Handle active class updates
  document.querySelectorAll('.nav-item').forEach(btn => {
    if (btn.getAttribute('data-filter') === targetFilter) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  if (targetFilter === 'settings') {
    timelineSection.style.display = 'none';
    settingsSection.style.display = 'block';
    banner.style.display = 'none';
  } else {
    timelineSection.style.display = 'block';
    settingsSection.style.display = 'none';

    currentFilter = targetFilter;
    
    // Display dynamic banner for active filters on timeline
    if (currentFilter !== 'all') {
      banner.style.display = 'flex';
      if (currentFilter === 'today') bannerText.textContent = "Today's Journey Milestones";
      else if (currentFilter === 'important') bannerText.textContent = "High & Critical Priority Tasks";
      else if (currentFilter === 'upcoming') bannerText.textContent = "Upcoming Journey Milestones";
      else if (currentFilter === 'completed') bannerText.textContent = "Completed Milestones";
    } else {
      banner.style.display = 'none';
    }

    renderTimeline();
  }

  // Auto close mobile drawer on navigations
  document.getElementById('app-sidebar').classList.remove('open');
};

// Close navigation banner (returns to All dashboard mode)
const clearActiveBanner = () => {
  handleNavSwitch('all');
};

// 13. System Event Binding
const bindEvents = () => {
  // Modal controllers
  document.getElementById('add-task-fab').addEventListener('click', openCreateModal);
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  document.getElementById('task-form').addEventListener('submit', handleFormSubmit);

  // Close modal when clicking outside form card wrapper
  document.getElementById('task-modal').addEventListener('click', (e) => {
    if (e.target.id === 'task-modal') closeModal();
  });

  // Toolbar search logic
  document.getElementById('search-input').addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderTimeline();
  });

  // Toolbar filters logic
  document.getElementById('filter-category').addEventListener('change', (e) => {
    categoryFilter = e.target.value;
    renderTimeline();
  });

  document.getElementById('filter-priority').addEventListener('change', (e) => {
    priorityFilter = e.target.value;
    renderTimeline();
  });

  document.getElementById('filter-status').addEventListener('change', (e) => {
    statusFilter = e.target.value;
    renderTimeline();
  });

  document.getElementById('sort-select').addEventListener('change', (e) => {
    sortOrder = e.target.value;
    renderTimeline();
  });

  // Nav Switch controllers
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const filter = e.currentTarget.getAttribute('data-filter');
      handleNavSwitch(filter);
    });
  });

  document.getElementById('clear-filter-banner').addEventListener('click', clearActiveBanner);

  // Calendar click actions
  document.getElementById('cal-prev').addEventListener('click', () => changeCalendarMonth('prev'));
  document.getElementById('cal-next').addEventListener('click', () => changeCalendarMonth('next'));

  // Motivation shuffle quotes button
  document.getElementById('btn-shuffle-quote').addEventListener('click', shuffleQuote);

  // Settings adjustments
  document.getElementById('settings-username').addEventListener('change', handleSaveSettings);
  document.getElementById('settings-theme').addEventListener('change', handleSaveSettings);
  document.getElementById('btn-export-data').addEventListener('click', exportDataJSON);
  document.getElementById('btn-reset-app').addEventListener('click', resetApplicationData);

  // Mobile Hamburger menu Drawer Toggle
  document.getElementById('mobile-toggle').addEventListener('click', () => {
    document.getElementById('app-sidebar').classList.add('open');
  });

  // Close mobile sidebar click overlay helper
  document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('app-sidebar');
    const toggle = document.getElementById('mobile-toggle');
    if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !toggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
};

// 14. Document Run Command
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  applyThemeClass(currentTheme);
  
  // Hydrate settings fields
  document.getElementById('settings-username').value = currentUsername;
  document.getElementById('settings-theme').value = currentTheme;

  bindEvents();
  shuffleQuote();
  renderDashboard();
});
