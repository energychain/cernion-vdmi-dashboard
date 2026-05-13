/**
 * VDMI Status Dashboard — App Logic
 * VNB / Netzbetreiber Tool für Versorgungsdokumentation
 */

var chartInstances = {};
var isDemoMode = false;
var currentFilter = { severity: '', status: '' };

document.addEventListener('DOMContentLoaded', function() {
  initSettings();
  setupTabs();
  setupFilters();
  testConnection().then(function(connected) {
    if (!connected) {
      isDemoMode = true;
      var badge = document.getElementById('demo-badge');
      if (badge) badge.style.display = 'block';
    }
    loadDashboard();
  });
});

function testConnection() {
  return new Promise(function(resolve) {
    api.get('api/openapi.json').then(function() { resolve(true); }).catch(function() { resolve(false); });
  });
}

function switchTab(tabId) {
  document.querySelectorAll('nav[aria-label="breadcrumb"] button').forEach(function(btn) {
    btn.classList.remove('active');
    if (btn.dataset.tab === tabId) btn.classList.add('active');
  });
  document.querySelectorAll('.tab-panel').forEach(function(p) { p.classList.remove('active'); });
  var panel = document.getElementById(tabId);
  if (panel) panel.classList.add('active');
  if (tabId === 'dashboard') loadDashboard();
  if (tabId === 'findings') loadFindings();
}

function setupTabs() {
  document.querySelectorAll('nav[aria-label="breadcrumb"] button').forEach(function(btn) {
    btn.addEventListener('click', function() { switchTab(btn.dataset.tab); });
  });
}

function setupFilters() {
  var severitySel = document.getElementById('filter-severity');
  var statusSel = document.getElementById('filter-status');
  if (severitySel) {
    severitySel.addEventListener('change', function() {
      currentFilter.severity = this.value;
      loadFindings();
    });
  }
  if (statusSel) {
    statusSel.addEventListener('change', function() {
      currentFilter.status = this.value;
      loadFindings();
    });
  }
}

// ===== Dashboard =====
function loadDashboard() {
  showLoading(true);
  api.getVdmiStatus().then(function(data) {
    renderKPIs(data);
    renderTrendChart();
    renderCategoryChart();
    showLoading(false);
  }).catch(function(e) {
    renderKPIs(DEMO_VDMI);
    renderTrendChart();
    renderCategoryChart();
    showLoading(false);
  });
}

function renderKPIs(data) {
  var container = document.getElementById('dashboard-cards');
  if (!container) return;

  var statusColor = data.auditScore >= 80 ? '#2a8a2a' : (data.auditScore >= 60 ? '#e8b339' : '#d05050');
  var statusText = data.auditScore >= 80 ? 'Gut' : (data.auditScore >= 60 ? 'Ausreichend' : 'Kritisch');

  container.innerHTML = '<div class="grid kpi-grid">' +
    '<article class="kpi-card" style="border-left:4px solid ' + statusColor + '">' +
    '<h3>Audit-Score</h3><p class="kpi-value" style="color:' + statusColor + '">' + data.auditScore + '<span>/100</span></p>' +
    '<small>' + statusText + '</small></article>' +
    '<article class="kpi-card"><h3>Offene Findings</h3><p class="kpi-value" style="color:#d05050">' + data.critical + '</p>' +
    '<small>Kritisch</small></article>' +
    '<article class="kpi-card"><h3>Warning</h3><p class="kpi-value" style="color:#e8b339">' + data.warning + '</p>' +
    '<small>Zu prüfen</small></article>' +
    '<article class="kpi-card"><h3>Nächste Deadline</h3><p class="kpi-value">' + (data.nextDeadline || '—') + '</p>' +
    '<small>Frist</small></article>' +
    '</div>';
}

function renderTrendChart() {
  var canvas = document.getElementById('trend-chart');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  if (chartInstances['trend']) chartInstances['trend'].destroy();

  chartInstances['trend'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: DEMO_TREND.map(function(t) { return t.month; }),
      datasets: [
        { label: 'Offen', data: DEMO_TREND.map(function(t) { return t.offen; }), backgroundColor: '#d05050' },
        { label: 'Geschlossen', data: DEMO_TREND.map(function(t) { return t.geschlossen; }), backgroundColor: '#2a8a2a' }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } }
    }
  });
}

function renderCategoryChart() {
  var canvas = document.getElementById('category-chart');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var cats = {};
  DEMO_FINDINGS.forEach(function(f) {
    cats[f.category] = (cats[f.category] || 0) + 1;
  });

  if (chartInstances['category']) chartInstances['category'].destroy();

  chartInstances['category'] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(cats),
      datasets: [{
        data: Object.values(cats),
        backgroundColor: ['#e8b339', '#5a8abf', '#2a8a2a', '#d05050', '#a060d0', '#40a0a0']
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'right' } }
    }
  });
}

// ===== Findings =====
function loadFindings() {
  showLoading(true);
  api.getVdmiFindings(currentFilter).then(function(data) {
    renderFindingsTable(data.findings || []);
    showLoading(false);
  }).catch(function(e) {
    var findings = DEMO_FINDINGS;
    if (currentFilter.severity) findings = findings.filter(function(f) { return f.severity === currentFilter.severity; });
    if (currentFilter.status) findings = findings.filter(function(f) { return f.status === currentFilter.status; });
    renderFindingsTable(findings);
    showLoading(false);
  });
}

function renderFindingsTable(findings) {
  var tbody = document.querySelector('#findings-table tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  findings.forEach(function(f) {
    var row = document.createElement('tr');
    var sevClass = 'badge-' + f.severity;
    var statusClass = 'badge-' + f.status;
    row.innerHTML = '<td><strong>' + f.id + '</strong></td>' +
      '<td><span class="badge ' + sevClass + '">' + f.severity + '</span></td>' +
      '<td>' + f.category + '</td>' +
      '<td>' + f.message + '</td>' +
      '<td><span class="badge ' + statusClass + '">' + f.status + '</span></td>' +
      '<td>' + (f.dueDate || '—') + '</td>' +
      '<td>' + f.assignee + '</td>';
    tbody.appendChild(row);
  });
}

// ===== Settings =====
function initSettings() {
  var form = document.getElementById('settings-form');
  if (!form || form._initialized) return;
  form._initialized = true;
  form.onsubmit = function(e) {
    e.preventDefault();
    api.saveConfig({
      baseUrl: document.getElementById('cfg-url').value,
      tenantId: document.getElementById('cfg-tenant').value,
      token: document.getElementById('cfg-token').value
    });
    alert('Einstellungen gespeichert');
  };
}

function showLoading(show) {
  var el = document.getElementById('loading');
  if (el) el.style.display = show ? 'block' : 'none';
}
