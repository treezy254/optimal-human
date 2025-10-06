export const TimeboxView = {
  sections: {
    topTasks: '#topTasksList',
    secondaryTasks: '#secondaryTasksList',
    brainDump: '#brainDumpLines',
    timebox: '#timeboxGrid'
  },
  
  // Update initUI to accept projects
  initUI(projects = []) {
    this.makeTaskList('topTasksList', 3, 'Enter top task', false, projects);
    this.makeTaskList('secondaryTasksList', 2, 'Enter secondary task', false, projects);
    this.makeTaskList('brainDumpLines', 5, 'Enter task', true, projects);
    this.renderTimeboxGrid();
  },

  // Update makeTaskList to add project selector
  makeTaskList(id, count, placeholderPrefix, small = false, projects = []) {
    const projectOptions = `
      <option value="">No Project</option>
      ${projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
    `;

    const container = document.getElementById(id);
    container.innerHTML = Array.from({ length: count }, (_, i) => `
      <li class="task-item flex items-center border-b border-gray-200 py-1 gap-2">
        <input type="checkbox" class="mr-2 flex-shrink-0">
        <input 
          type="text" 
          class="task-input w-full focus:outline-none ${small ? 'text-xs' : ''}" 
          placeholder="${placeholderPrefix} ${i + 1}"
        >
        <select 
          class="project-select text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none hidden bg-transparent"
        >
          ${projectOptions}
        </select>
      </li>
    `).join('');

    // Handle show/hide for project selectors
    container.querySelectorAll('.task-item').forEach(item => {
      const input = item.querySelector('.task-input');
      const select = item.querySelector('.project-select');

      input.addEventListener('focus', () => {
        select.classList.remove('hidden');
      });

      input.addEventListener('blur', () => {
        setTimeout(() => {
          if (document.activeElement !== select) {
            select.classList.add('hidden');
          }
        }, 150);
      });

      select.addEventListener('blur', () => {
        select.classList.add('hidden');
      });
    });
  },


  // ... (renderTimeboxGrid is unchanged)
  renderTimeboxGrid() {
    const hours = ['3am','4am','5am','6am','7am','8am','9am','10am'];
    document.getElementById('timeboxGrid').innerHTML = hours.map(h => `
      <div class="text-xs text-gray-600 text-right pr-2">${h}</div>
      <input type="text" class="text-xs border-b border-gray-200 focus:outline-none">`).join('');
  },

  getInputs() {
    const getInputs = (sel, type) => document.querySelectorAll(`${sel} ${type}`);
    return Object.fromEntries(Object.entries(this.sections).map(([k, sel]) => [
      k,
      { 
        text: getInputs(sel, 'input[type="text"]'), 
        checkbox: getInputs(sel, 'input[type="checkbox"]'),
        project: getInputs(sel, 'select.project-select')
      }
    ]));
  },

  updateHeaderColor(currentDate) {
    const header = document.getElementById('scheduleHeader');
    const today = new Date();
    today.setHours(0,0,0,0);
    currentDate.setHours(0,0,0,0);
    header.classList.remove('text-green-500','text-blue-500','text-orange-500');
    header.classList.add(
      currentDate.getTime() === today.getTime() ? 'text-green-500' :
      currentDate > today ? 'text-blue-500' : 'text-orange-500'
    );
  },

  fillInputs(data, inputs) {
    for (let [k, { text, checkbox, project }] of Object.entries(inputs)) {
      if (data[k]) {
        [...text].forEach((t, i) => t.value = data[k].text?.[i] || '');
        [...checkbox].forEach((c, i) => c.checked = data[k].checkbox?.[i] || false);
        if (project) {
          [...project].forEach((p, i) => p.value = data[k].projectId?.[i] || '');
        }
      }
    }
  },

  collectInputs(inputs) {
    const data = {};
    for (let [k, { text, checkbox, project }] of Object.entries(inputs)) {
      data[k] = { 
        text: [...text].map(t => t.value), 
        checkbox: [...checkbox].map(c => c.checked),
        projectId: project ? [...project].map(p => p.value) : []
      };
    }
    return data;
  }
};
