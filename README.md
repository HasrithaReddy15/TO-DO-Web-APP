# TaskJourney — Visual Task Timeline Dashboard

A completely original, portfolio-ready, and ATS-friendly Task Management Web Application. **TaskJourney** replaces the standard grid lists or Kanban boards of Todoist/Trello with a **Journey Timeline** where every task acts as a milestone along your roadmap to execution.

Designed with a sleek glassmorphic dashboard layout using vanilla **HTML5**, **CSS3**, and **ES6+ JavaScript**, this application is self-contained, high-performing, and built with portfolio reviews and internship recruitment submissions in mind.

---

## 🌟 Visual Layout

### 1. Left Navigation Sidebar (Fixed)
- **Brand Logo & Tagline**: Identity-branded header with custom SVG graphics.
- **Navigation Options**: Quick filters for Dashboard (All), Today's Tasks, Important, Upcoming, Completed, and Settings views.
- **Today's Completion Gauge**: A circular progress ring (animated SVG radial meter) showing the completion percentage of today's milestones with dynamic, encouraging feedback text (e.g. *"Let's check your first item!"*, *"Finish strong!"*).

### 2. Center Workspace (Timeline Engine)
- **Journey Timeline Layout**: Tasks render as interactive milestones connected along a vertical timeline thread line.
- **Milestone Task Cards**:
  - Custom checkbox representing milestone check-in.
  - Interactive headers (expand/collapse description details).
  - Categorised badges (Work 💼, Personal 🏠, Health 🍏, Finance 💰, Other 🏷️).
  - Priority pills (Low, Medium, High, Critical) and time indicators.
  - Action commands (Edit, Delete, Expand).
  - Visual Transitions: Completed tasks fade, apply strike-through typography, turn milestone dots green, and fade timeline path links.
- **Floating Action Button (FAB)**: A pulsing `+ Add Task` button in the corner to trigger modal forms.

### 3. Right Summary Panel
- **Analytics Widgets**: KPI status overview cards (Total, Completed, Pending, Overdue).
- **Next Milestone**: Displays the closest pending future deadline task with an active time-remaining countdown (e.g. *"30m left"*, *"2h left"*, *"1d left"*).
- **Mini-Calendar Grid**: A custom, dynamically rendered grid highlighting today's date and showing subtle task-presence dots below days with scheduled milestones.
- **Reminders Panel**: Highlights upcoming alert-enabled tasks.
- **Wisdom Card**: A daily motivation quote deck with a gradient background and shuffle trigger.

---

## 🚀 Key Features & Implementation Architecture

- **Interactive CRUD Milestones**: Create, edit, toggle, and delete tasks dynamically.
- **Multi-Level Querying**:
  - Text search indexing (matches title & description).
  - Category filters.
  - Priority level filters.
  - Sorting criteria (earliest date first, latest date first, earliest time, highest priority).
- **Local Persistence & Hydration**: Tightly integrated local cache backup. If the application is opened for the first time, it hydrates itself with mock placement prep milestones to instantly showcase functionality.
- **Dynamic Themes**: Personalise settings with color tokens (Indigo & Violet Glow, Rose & Amber Sunrise, Emerald & Teal Mint, Slate Darker Mode).
- **Mobile Responsive Drawer Menu**: Grid transitions from a 3-column layout on desktop to single column stack layouts on tablet and mobile viewports, using a burger menu drawer toggle.
- **Export System**: Export full JSON backups directly to your local file system.

---

## 📁 Repository Structure

```
TaskJourney/
│── index.html          # Core layout structural HTML
│── style.css           # Styling, design tokens, glassmorphism, responsive breakpoints, animations
│── script.js          # Interactive state management, timeline updates, storage, filter logic
└── README.md           # Professional project documentation (this file)
```

---

## 🛠️ Getting Started & Technical Installation

1. **Clone or Download** the folder.
2. **Double-click** or open `index.html` in any web browser (Google Chrome, Firefox, Safari, Microsoft Edge). No servers, bundlers (`npm install`), or compiler frameworks are required.
3. To view or inspect the code, open the files in an IDE such as VS Code.
