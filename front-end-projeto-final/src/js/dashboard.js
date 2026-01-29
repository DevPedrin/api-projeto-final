import { getMe } from '../api/users.js';
import { getDashboardData } from '../api/dashboard.js';

/* =========================
   INIT
========================= */
init();

async function init() {
  try {
    const [me, dash] = await Promise.all([
      getMe(),
      getDashboardData()
    ]);

    if (!dash?.ok) throw new Error('DASHBOARD_ERROR');

    applyRoleRules(me.data.role_name);
    fillDashboard(dash.data);
    renderChart(dash.data.movimentosMes);

  } catch (err) {
    console.error(err);
  }
}

/* =========================
   ROLE RULES
========================= */
function applyRoleRules(role) {
  const usersCard = document.querySelector('.card-users');
  if (!usersCard) return;

  if (!['ADM', 'TI'].includes(role)) {
    usersCard.remove(); // remove de vez, não pisca
  }
}

/* =========================
   FILL DATA
========================= */
function fillDashboard(data) {
  const mov = data.movimentosMes || { entradas: 0, saidas: 0 };

  const totalUsuariosEl = document.getElementById('totalUsuarios');
  if (totalUsuariosEl) {
    totalUsuariosEl.textContent = data.totalUsuarios ?? 0;
  }

  document.getElementById('totalProdutos').textContent = data.totalProdutos ?? 0;
  document.getElementById('totalEntradas').textContent = mov.entradas ?? 0;
  document.getElementById('totalSaidas').textContent = mov.saidas ?? 0;
}

/* =========================
   CHART
========================= */
let chartInstance = null;

function renderChart(mov = {}) {
  if (typeof Chart === 'undefined') return;

  const entradas = mov.entradas ?? 0;
  const saidas = mov.saidas ?? 0;

  const ctx = document.createElement('canvas');
  const chartContainer = document.getElementById('chart');
  chartContainer.innerHTML = '';
  chartContainer.appendChild(ctx);

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Entradas', 'Saídas'],
      datasets: [{
  data: [entradas, saidas],
  backgroundColor: ['#4CAF50', '#F44336'],
  borderRadius: 6,
  barThickness: 20,        // largura fixa (quanto menor, mais fina)
  maxBarThickness: 50     // limite máximo
}]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Movimentações do mês'
        }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}
