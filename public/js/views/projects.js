// js/projects.js
import { auth, db, doc, setDoc, getDoc, collection, getDocs, updateDoc } from '../firebase.js';

// --- MODEL ---
export const ProjectsModel = {
  // Save all projects to Firestore and local cache
  async save(projects) {
    localStorage.setItem('projects', JSON.stringify(projects));
    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(doc(db, 'projects', user.uid), { list: projects });
      } catch (err) {
        console.error('Firestore projects save error:', err);
      }
    }
  },
  // Load projects from Firestore first, then fall back to local cache
  async load() {
    const user = auth.currentUser;
    if (user) {
      try {
        const docRef = doc(db, 'projects', user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists() && snap.data().list) {
          const projects = snap.data().list;
          localStorage.setItem('projects', JSON.stringify(projects));
          return projects;
        }
      } catch (err) {
        console.warn('Firestore projects load failed, falling back to local cache');
      }
    }
    return JSON.parse(localStorage.getItem('projects')) || [];
  }
};

// --- VIEW ---
export const ProjectsView = {
  render(projects) {
    const container = document.getElementById('projectsView');
    container.innerHTML = `
      <div style="min-height: 650px;">
        <div class="flex justify-between items-center mb-4">
          <p class="text-sm text-gray-600">Organize your tasks into projects.</p>
          <button id="addProjectBtn" class="px-3 py-1.5 bg-green-500 text-white rounded-md text-sm font-semibold hover:bg-green-600">
            + New Project
          </button>
        </div>
        <div id="project-cards" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${projects.map(p => this.createProjectCard(p)).join('') || `<p class="text-gray-500 col-span-full">No projects yet. Click 'New Project' to create one!</p>`}
        </div>
      </div>
    `;
  },
  createProjectCard(project) {
    return `
      <div class="border rounded-lg p-4 ${project.completed ? 'bg-gray-100 opacity-60' : 'bg-white'}">
        <h3 class="font-bold">${project.name}</h3>
        <div class="mt-4 flex items-center justify-between">
          <span class="text-xs font-semibold ${project.completed ? 'text-green-600' : 'text-gray-600'}">
            ${project.completed ? 'Completed' : 'In Progress'}
          </span>
          <button data-id="${project.id}" class="toggle-complete-btn px-2 py-1 text-xs rounded ${project.completed ? 'bg-gray-400' : 'bg-blue-500'} text-white">
            ${project.completed ? 'Reopen' : 'Complete'}
          </button>
        </div>
      </div>
    `;
  },
  showModal(show = true) {
    document.getElementById('projectModal').classList.toggle('hidden', !show);
    if(show) document.getElementById('newProjectName').focus();
  },
  
  clearInput() {
    document.getElementById('newProjectName').value = '';
  }
};