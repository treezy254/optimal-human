// js/controller.js (updated)

import { TimeboxModel } from './model.js';
import { TimeboxView } from './view.js';
import { ProjectsModel, ProjectsView } from './projects.js';
import { DashboardView } from './dashboard.js';
import { auth, provider, signInWithPopup, onAuthStateChanged, signOut } from './firebase.js';

// --- HELPER FUNCTION ---
// Debounce utility to limit how often a function can run
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

document.addEventListener('DOMContentLoaded', () => {
  let currentDate = new Date();
  let allProjects = [];
  let currentView = 'timebox';

  const views = {
    timebox: document.getElementById('timeboxView'),
    dashboard: document.getElementById('dashboardView'),
    projects: document.getElementById('projectsView'),
  };

  const dateInput = document.getElementById('dateInput');
  flatpickr(dateInput, {
    dateFormat: "m/d/Y",
    defaultDate: currentDate,
    onChange: ([d]) => {
      currentDate = d;
      updateSchedule();
    }
  });

  // === AUTH HANDLING ===
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const userDisplay = document.getElementById('userDisplay');

  loginBtn.onclick = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) { console.error('Login failed', err); }
  };
  logoutBtn.onclick = () => signOut(auth);

  onAuthStateChanged(auth, async user => {
    if (user) {
      userDisplay.textContent = `👋 ${user.displayName}`;
      loginBtn.classList.add('hidden');
      logoutBtn.classList.remove('hidden');
      await loadInitialData(true); // Pass true for online state
    } else {
      userDisplay.textContent = 'Offline mode';
      loginBtn.classList.remove('hidden');
      logoutBtn.classList.add('hidden');
      await loadInitialData(false); // Pass false for offline state
    }
  });
  
  // === NAVIGATION ===
  async function navigate(viewName) {
    currentView = viewName;
    document.getElementById('viewTitle').textContent = viewName.toUpperCase();
    if (viewName == "dashboard") {
      document.getElementById('viewTitle').textContent = "My Productivity";
    }
    if (viewName == "timebox") {
      document.getElementById('viewTitle').textContent = "Daily Timebox";
    }

    Object.entries(views).forEach(([name, el]) => {
      el.classList.toggle('hidden', name !== viewName);
    });
    
    document.getElementById('dateInput').parentElement.classList.toggle('hidden', viewName !== 'timebox');

    // Render view-specific content
    if (viewName === 'dashboard') {
      // Use the correct data source based on login state
      const allTimeboxData = auth.currentUser 
          ? await TimeboxModel.loadAllFirestoreData() // Use new Firestore function when online
          : TimeboxModel.loadAllLocalData(); // Fallback to local when offline
      DashboardView.render(allTimeboxData, allProjects);
    } else if (viewName === 'projects') {
      ProjectsView.render(allProjects);
      addProjectEventListeners();
    }
  }

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.onclick = () => navigate(btn.dataset.view);
  });

  // === CORE FUNCTIONS ===
  async function loadInitialData(isOnline = false) {
    allProjects = await ProjectsModel.load();
    
    if (isOnline) {
      // This syncs all past data to local storage for a logged-in user
      await TimeboxModel.loadAllFirestoreData();
    }

    TimeboxView.initUI(allProjects);
    await updateSchedule(); // Load today's schedule
  }

  async function updateSchedule() {
    dateInput.value = TimeboxModel.formatDate(currentDate);
    const savedData = await TimeboxModel.load(currentDate);
    const inputs = TimeboxView.getInputs();
    TimeboxView.fillInputs(savedData, inputs);
    TimeboxView.updateHeaderColor(currentDate);
  }

  function saveData() {
    if (currentView !== 'timebox') return;
    const inputs = TimeboxView.getInputs();
    const data = TimeboxView.collectInputs(inputs);
    TimeboxModel.save(currentDate, data);
  }
  
  // Create a debounced version of the saveData function with a 1-second delay
  const debouncedSave = debounce(saveData, 1000);

  // === EVENT LISTENERS ===
  // Use the debounced function to save data
  document.getElementById('timeboxView').addEventListener('input', debouncedSave);

  // Date navigation
  document.getElementById('prevDate').onclick = () => {
    currentDate.setDate(currentDate.getDate() - 1);
    flatpickr(dateInput).setDate(currentDate, true);
  };
  document.getElementById('nextDate').onclick = () => {
    currentDate.setDate(currentDate.getDate() + 1);
    flatpickr(dateInput).setDate(currentDate, true);
  };

  // Projects View Listeners
  function addProjectEventListeners() {
    document.getElementById('addProjectBtn')?.addEventListener('click', () => ProjectsView.showModal(true));
    document.querySelectorAll('.toggle-complete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const projectId = e.target.dataset.id;
        const project = allProjects.find(p => p.id === projectId);
        if (project) {
          project.completed = !project.completed;
          await ProjectsModel.save(allProjects);
          ProjectsView.render(allProjects);
          addProjectEventListeners();
        }
      });
    });
  }

  // Project Modal Listeners
  document.getElementById('cancelProjectBtn').onclick = () => ProjectsView.showModal(false);
  document.getElementById('saveProjectBtn').onclick = async () => {
    const nameInput = document.getElementById('newProjectName');
    const newName = nameInput.value.trim();
    if (newName) {
      allProjects.push({ id: `proj-${Date.now()}`, name: newName, completed: false });
      await ProjectsModel.save(allProjects);
      ProjectsView.render(allProjects);
      addProjectEventListeners();
      ProjectsView.clearInput();
      ProjectsView.showModal(false);
      TimeboxView.initUI(allProjects);
      await updateSchedule();
    }
  };
});