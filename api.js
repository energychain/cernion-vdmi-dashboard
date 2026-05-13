/**
 * VDMI Dashboard — API Client + Demo-Daten
 */

var CERNION_CONFIG_KEY = 'cernion.api.config';

// --- VDMI Demo Data ---
var DEMO_VDMI = {
  auditScore: 72,
  lastAudit: "2026-05-10T09:30:00Z",
  auditor: "TÜV Rheinland Energie",
  totalFindings: 15,
  critical: 2,
  warning: 5,
  info: 8,
  status: "partial",
  nextDeadline: "2026-06-15"
};

var DEMO_FINDINGS = [
  { id: "VDMI-2026-001", code: "MESS_UNVOLLST", severity: "error", category: "Messung", status: "offen", message: "Zählerwechsel Q1/2026 nicht vollständig dokumentiert", dueDate: "2026-05-20", assignee: "Netzbetrieb" },
  { id: "VDMI-2026-002", code: "SLP_VERALTET", severity: "error", category: "Lastprofile", status: "offen", message: "H0-Profil für 3 MeLos nicht auf Version 2024 aktualisiert", dueDate: "2026-05-25", assignee: "EDM-Team" },
  { id: "VDMI-2026-003", code: "ABW_PLAUSI", severity: "warning", category: "Abrechnung", status: "in_bearbeitung", message: "Abweichungsprüfung für Industrie-Kunde fehlt", dueDate: "2026-05-30", assignee: "Kundenservice" },
  { id: "VDMI-2026-004", code: "MASTR_SYNC", severity: "warning", category: "Stammdaten", status: "offen", message: "MaStR-Sync letzter Lauf: 14 Tage her", dueDate: "2026-05-18", assignee: "Data Engineering" },
  { id: "VDMI-2026-005", code: "BILANZ_KREIS", severity: "warning", category: "Bilanzkreis", status: "in_bearbeitung", message: "Bilanzkreisabgrenzung Q1 nicht finalisiert", dueDate: "2026-06-01", assignee: "Handel" },
  { id: "VDMI-2026-006", code: "REDISP_NACHW", severity: "warning", category: "Redispatch", status: "offen", message: "Entlastungsnachweis für 2 Flex-Geräte fehlt", dueDate: "2026-06-10", assignee: "Flex-Team" },
  { id: "VDMI-2026-007", code: "DOCS_SIGN", severity: "warning", category: "Dokumentation", status: "offen", message: "3 VDMI-Dokumente nicht signiert", dueDate: "2026-05-22", assignee: "QS" },
  { id: "VDMI-2026-008", code: "WS_FAKTOR", severity: "info", category: "Messung", status: "geschlossen", message: "Wandlungsverhältnis Trafo T3 aktualisiert", dueDate: "", assignee: "Netzbetrieb" },
  { id: "VDMI-2026-009", code: "OBIS_CHECK", severity: "info", category: "Messung", status: "geschlossen", message: "OBIS-Register-Validierung erfolgreich", dueDate: "", assignee: "EDM-Team" },
  { id: "VDMI-2026-010", code: "ZEITZONE", severity: "info", category: "Zeitreihen", status: "geschlossen", message: "Zeitzonen-Handling für Sommerzeit geprüft", dueDate: "", assignee: "EDM-Team" },
  { id: "VDMI-2026-011", code: "KUNDEN_ANL", severity: "info", category: "Stammdaten", status: "geschlossen", message: "Kundenanlagen-Verzeichnis aktualisiert", dueDate: "", assignee: "Data Engineering" },
  { id: "VDMI-2026-012", code: "TARIF_PRÜF", severity: "info", category: "Abrechnung", status: "in_bearbeitung", message: "Tarifprüfung für neue Kunden läuft", dueDate: "2026-05-28", assignee: "Kundenservice" },
  { id: "VDMI-2026-013", code: "SPANN_BAND", severity: "info", category: "Netzbetrieb", status: "geschlossen", message: "Spannungsband-Dokumentation vollständig", dueDate: "", assignee: "Netzbetrieb" },
  { id: "VDMI-2026-014", code: "SCHALT_ANL", severity: "info", category: "Netzbetrieb", status: "geschlossen", message: "Schaltanlagen-Protokoll Q1 eingereicht", dueDate: "", assignee: "Netzbetrieb" },
  { id: "VDMI-2026-015", code: "TRÄG_HEIZ", severity: "info", category: "Redispatch", status: "in_bearbeitung", message: "Trägerheizung Übergang Sommer/Winter dokumentiert", dueDate: "2026-05-20", assignee: "Flex-Team" }
];

// Trend data: findings per month
var DEMO_TREND = [
  { month: "2026-01", total: 8, offen: 3, geschlossen: 5 },
  { month: "2026-02", total: 12, offen: 5, geschlossen: 7 },
  { month: "2026-03", total: 10, offen: 4, geschlossen: 6 },
  { month: "2026-04", total: 14, offen: 6, geschlossen: 8 },
  { month: "2026-05", total: 15, offen: 7, geschlossen: 8 }
];

class CernionAPI {
  constructor() {
    this.config = this.loadConfig();
    this.config.baseUrl = (this.config.baseUrl || 'https://api.cernion.de/').replace(/\/api\/$/, '');
  }
  loadConfig() {
    try {
      var raw = localStorage.getItem(CERNION_CONFIG_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { baseUrl: 'https://api.cernion.de/', tenantId: 'agentic-hackathon', token: '' };
  }
  saveConfig(cfg) {
    for (var k in cfg) this.config[k] = cfg[k];
    localStorage.setItem(CERNION_CONFIG_KEY, JSON.stringify(this.config));
  }
  get headers() {
    var h = { 'Content-Type': 'application/json', 'x-tenant-id': this.config.tenantId };
    if (this.config.token) h['Authorization'] = 'Bearer ' + this.config.token;
    return h;
  }
  async get(endpoint) {
    try {
      var res = await fetch(this.config.baseUrl + endpoint, { headers: this.headers });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    } catch (e) { e.isCORS = e.message.indexOf('Failed') >= 0; throw e; }
  }
  async getVdmiStatus() {
    try { return await this.get('api/vdmi'); }
    catch (e) { return { success: true, ...DEMO_VDMI }; }
  }
  async getVdmiFindings(filter) {
    try { return await this.get('api/vdmi/findings' + (filter ? '?' + new URLSearchParams(filter) : '')); }
    catch (e) {
      var findings = DEMO_FINDINGS;
      if (filter && filter.severity) findings = findings.filter(function(f) { return f.severity === filter.severity; });
      if (filter && filter.status) findings = findings.filter(function(f) { return f.status === filter.status; });
      return { success: true, findings: findings };
    }
  }
}

var api = new CernionAPI();
