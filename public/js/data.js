// js/data.js

export const sampleProjects = [
  { id: 'proj-1', name: 'Website Redesign', completed: false },
  { id: 'proj-2', name: 'Q4 Marketing Campaign', completed: false },
  { id: 'proj-3', name: 'Mobile App Launch', completed: true },
];

const formatDate = (date) => `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

const createSampleDayData = (completedTop, totalTop, completedSecondary, totalSecondary) => {
    const data = {
        topTasks: { text: [], checkbox: [], projectId: [] },
        secondaryTasks: { text: [], checkbox: [], projectId: [] },
        brainDump: { text: ["Misc task"], checkbox: [true], projectId: [""] },
        timebox: { text: [], checkbox: [], projectId: [] }
    };
    for (let i = 0; i < totalTop; i++) {
        data.topTasks.text.push(`Top task ${i + 1}`);
        data.topTasks.checkbox.push(i < completedTop);
        data.topTasks.projectId.push('proj-1');
    }
    for (let i = 0; i < totalSecondary; i++) {
        data.secondaryTasks.text.push(`Secondary task ${i + 1}`);
        data.secondaryTasks.checkbox.push(i < completedSecondary);
        data.secondaryTasks.projectId.push('proj-2');
    }
    return data;
};

const today = new Date();
export const sampleTimeboxData = {};

// Populate data for the last 7 days for a better weekly view
for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const key = formatDate(date);
    
    // Create some varied data
    const completedTop = Math.floor(Math.random() * 3) + 1; // 1 to 3
    const totalTop = 3;
    const completedSecondary = Math.floor(Math.random() * 2); // 0 to 1
    const totalSecondary = 2;

    sampleTimeboxData[key] = createSampleDayData(completedTop, totalTop, completedSecondary, totalSecondary);
}