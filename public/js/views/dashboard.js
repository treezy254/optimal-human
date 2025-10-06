// js/dashboard.js
let productivityChart = null;

function formatDate(date) {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

export const DashboardView = {
  currentRange: 'weekly',
  allTimeboxData: {},

  render(allTimeboxData = {}, projects = []) {
    this.allTimeboxData = allTimeboxData;

    const container = document.getElementById('dashboardView');
    const stats = this.calculateStats(allTimeboxData);

    const renderStatCard = (value, title, styleType = 'neutral') => {
      // ... (this function remains the same)
      const baseStyle = "rounded-xl p-5 shadow-sm border border-gray-100 transition-colors";
      let style = "bg-white text-gray-900"; 
      let titleColor = "text-gray-700 font-medium"; 
      let valueColor = "text-gray-900 font-bold"; 

      if (styleType === "completed") {
        style = "bg-green-500 text-white"; 
        titleColor = "text-green-100";
        valueColor = "text-white";
      }

      // Handle average productivity color logic
      if (title.toLowerCase().includes("avg productivity")) {
        const numValue = parseFloat(value);
        if (numValue < 40) valueColor = "text-red-600";
        else if (numValue < 75) valueColor = "text-blue-600";
        else valueColor = "text-green-600";
      }

      return `
        <div class="${baseStyle} ${style}">
          <p class="text-xs ${titleColor}">${title}</p>
          <p class="text-3xl mt-2 ${valueColor}">${value}</p>
        </div>`;
    };


    container.innerHTML = `
      <div class="space-y-6" style="min-height: 650px;">
        <div class="flex justify-between items-center">
          <p class="text-sm text-gray-500">Your productivity overview.</p>
        </div>
        <div class="flex flex-col lg:flex-row gap-6">
        
          <div class="flex-1 bg-white border border-gray-200 text-gray-900 p-6 rounded-2xl" style="height: 350px;">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2 rounded-lg bg-gray-100 p-1">
                <button id="weeklyBtn" class="chart-range-btn px-3 py-1 text-xs font-semibold rounded-md bg-white">Weekly</button>
                <button id="monthlyBtn" class="chart-range-btn px-3 py-1 text-xs font-semibold rounded-md">Monthly</button>
              </div>
            </div>

            <div class="flex items-center space-x-2 mb-3">
              <span class="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
              <span class="text-xs text-gray-600">Productivity (Completed %)</span>
            </div>

 
            
            <div style="height: 200px;">
              <canvas id="productivityChart"></canvas>
            </div>
          </div>

          <div class="lg:w-72 flex-shrink-0 space-y-4">
            ${renderStatCard(`${stats.tasksCompletedToday}`, 'Tasks Completed', 'completed')}
            ${renderStatCard(`${stats.totalTasksToday}`, 'Total Tasks')}
            ${renderStatCard(`${stats.avgProductivity}%`, 'Avg Productivity')}
          </div>
        </div>

      </div>
    `;

    this.updateChartView();
    this.attachEventListeners();
  },

  // ... (all other methods like calculateStats, calculateChartData, etc. remain the same) ...
  
  calculateStats(allTimeboxData) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const todayKey = formatDate(today);
    const yesterdayKey = formatDate(yesterday);

    const countTasks = (data) => {
      let completed = 0;
      let total = 0;
      Object.values(data || {}).forEach((section) => {
        if (!section) return;
        if (section.checkbox && section.text) {
          section.checkbox.forEach((isChecked, i) => {
            if (section.text[i]) {
              total++;
              if (isChecked) completed++;
            }
          });
        }
      });
      return { completed, total };
    };

    const todayCounts = countTasks(allTimeboxData[todayKey] || {});
    const avgProductivity =
      todayCounts.total > 0
        ? Math.round((todayCounts.completed / todayCounts.total) * 100)
        : 0;

    return {
      tasksCompletedToday: todayCounts.completed,
      totalTasksToday: todayCounts.total,
      avgProductivity,
    };
  },

  calculateChartData(range = "weekly") {
    const today = new Date();
    const dates = [];
    const labels = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    if (range === "weekly") {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date);
        labels.push(dayNames[date.getDay()]);
      }

      const dailyStats = dates.map((date) => {
        const key = formatDate(date);
        const data = this.allTimeboxData[key] || {};
        const s = this.countTasks(data);
        return s.total > 0 ? (s.completed / s.total) * 100 : 0;
      });

      return { labels, percentages: dailyStats };
    }

    // Monthly view: simplify same as before but only one dataset
    const weeks = [];
    const getWeekNum = (d) => {
      const oneJan = new Date(d.getFullYear(), 0, 1);
      return Math.ceil((((d - oneJan) / 86400000) + oneJan.getDay() + 1) / 7);
    };

    for (let w = 0; w < 9; w++) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - w * 7);
      let completed = 0, total = 0;
      for (let i = 0; i < 7; i++) {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        const key = formatDate(d);
        const s = this.countTasks(this.allTimeboxData[key] || {});
        completed += s.completed;
        total += s.total;
      }
      weeks.unshift({
        label: `W${getWeekNum(weekStart)}`,
        percentage: total ? (completed / total) * 100 : 0,
      });
    }

    return {
      labels: weeks.map((w) => w.label),
      percentages: weeks.map((w) => w.percentage),
    };
  },

  countTasks(data) {
    let completed = 0, total = 0;
    Object.values(data || {}).forEach((section) => {
      if (!section) return;
      if (section.checkbox && section.text) {
        section.checkbox.forEach((isChecked, i) => {
          if (section.text[i]) {
            total++;
            if (isChecked) completed++;
          }
        });
      }
    });
    return { completed, total };
  },

  updateChartView() {
    const chartData = this.calculateChartData(this.currentRange);
    this.renderProductivityChart(chartData);

    document.getElementById("weeklyBtn")?.classList.toggle("bg-white", this.currentRange === "weekly");
    document.getElementById("monthlyBtn")?.classList.toggle("bg-white", this.currentRange === "monthly");
  },

  renderProductivityChart(chartData) {
    const ctx = document.getElementById("productivityChart")?.getContext("2d");
    if (!ctx) return;
    if (productivityChart) productivityChart.destroy();

    productivityChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: "Productivity",
            data: chartData.percentages,
            backgroundColor: "#111827", // dark gray bars
            borderRadius: 6,
            barThickness: 14,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            ticks: { color: "#374151", font: { weight: '500' } },
            grid: { display: false },
          },
          y: {
            min: 0,
            max: 100,
            ticks: {
              color: "#4B5563",
              stepSize: 20,
              callback: function(value) {
                // Show only 20, 40, 60, 80, 100 but keep spacing
                if ([0, 20, 40, 60, 80, 100].includes(value)) return value;
                return '';
              }
            },
            grid: { color: "#E5E7EB" },
          },
        },
      },
    });
  },


  attachEventListeners() {
    document.getElementById("weeklyBtn")?.addEventListener("click", () => {
      this.currentRange = "weekly";
      this.updateChartView();
    });
    document.getElementById("monthlyBtn")?.addEventListener("click", () => {
      this.currentRange = "monthly";
      this.updateChartView();
    });
  },
};