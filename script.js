document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('dateInput');
    const prevDateBtn = document.getElementById('prevDate');
    const nextDateBtn = document.getElementById('nextDate');
    const scheduleHeader = document.getElementById('scheduleHeader');
    const topTasks = document.querySelectorAll('#currentTimebox ul:first-of-type input[type="text"]');
    const topTasksCheckboxes = document.querySelectorAll('#currentTimebox ul:first-of-type input[type="checkbox"]');
    const secondaryTasks = document.querySelectorAll('#currentTimebox ul:nth-of-type(2) input[type="text"]');
    const secondaryTasksCheckboxes = document.querySelectorAll('#currentTimebox ul:nth-of-type(2) input[type="checkbox"]');
    const brainDumpTasks = document.querySelectorAll('#brainDumpLines input[type="text"]');
    const brainDumpCheckboxes = document.querySelectorAll('#brainDumpLines input[type="checkbox"]');
    const timeboxInputs = document.querySelectorAll('#currentTimebox .grid input[type="text"]');

    let currentDate = new Date();

    // Initialize Flatpickr
    const fp = flatpickr(dateInput, {
        dateFormat: "m/d/Y",
        onChange: function(selectedDates, dateStr, instance) {
            currentDate = selectedDates[0];
            updateSchedule();
        }
    });

    function formatDate(date) {
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }

    function updateSchedule() {
        const formattedDate = formatDate(currentDate);
        dateInput.value = formattedDate;
        loadFromLocalStorage(formattedDate);
        updateHeaderColor();
    }

    function updateHeaderColor() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);

        if (currentDate.getTime() === today.getTime()) {
            scheduleHeader.classList.add('text-green-500');
            scheduleHeader.classList.remove('text-blue-500', 'text-orange-500');
        } else if (currentDate > today) {
            scheduleHeader.classList.add('text-blue-500');
            scheduleHeader.classList.remove('text-green-500', 'text-orange-500');
        } else {
            scheduleHeader.classList.add('text-orange-500');
            scheduleHeader.classList.remove('text-green-500', 'text-blue-500');
        }
    }

    function loadFromLocalStorage(date) {
        const savedData = JSON.parse(localStorage.getItem(`dailyTimeboxData_${date}`)) || {};
        
        topTasks.forEach((task, index) => task.value = savedData.topTasks?.[index] || '');
        topTasksCheckboxes.forEach((checkbox, index) => checkbox.checked = savedData.topTasksCheckboxes?.[index] || false);
        secondaryTasks.forEach((task, index) => task.value = savedData.secondaryTasks?.[index] || '');
        secondaryTasksCheckboxes.forEach((checkbox, index) => checkbox.checked = savedData.secondaryTasksCheckboxes?.[index] || false);
        brainDumpTasks.forEach((task, index) => task.value = savedData.brainDumpTasks?.[index] || '');
        brainDumpCheckboxes.forEach((checkbox, index) => checkbox.checked = savedData.brainDumpCheckboxes?.[index] || false);
        timeboxInputs.forEach((input, index) => input.value = savedData.timeboxInputs?.[index] || '');
    }

    function saveToLocalStorage() {
        const formattedDate = formatDate(currentDate);
        const dataToSave = {
            topTasks: Array.from(topTasks).map(task => task.value),
            topTasksCheckboxes: Array.from(topTasksCheckboxes).map(checkbox => checkbox.checked),
            secondaryTasks: Array.from(secondaryTasks).map(task => task.value),
            secondaryTasksCheckboxes: Array.from(secondaryTasksCheckboxes).map(checkbox => checkbox.checked),
            brainDumpTasks: Array.from(brainDumpTasks).map(task => task.value),
            brainDumpCheckboxes: Array.from(brainDumpCheckboxes).map(checkbox => checkbox.checked),
            timeboxInputs: Array.from(timeboxInputs).map(input => input.value)
        };
        localStorage.setItem(`dailyTimeboxData_${formattedDate}`, JSON.stringify(dataToSave));
    }

    prevDateBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 1);
        updateSchedule();
    });

    nextDateBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 1);
        updateSchedule();
    });

    // Load saved data on page load
    updateSchedule();

    // Save data when inputs change
    [dateInput, ...topTasks, ...topTasksCheckboxes, ...secondaryTasks, ...secondaryTasksCheckboxes, ...brainDumpTasks, ...brainDumpCheckboxes, ...timeboxInputs].forEach(input => {
        input.addEventListener('input', saveToLocalStorage);
        input.addEventListener('change', saveToLocalStorage);
    });
});



