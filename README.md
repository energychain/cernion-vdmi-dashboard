# 📋 VDMI Status Dashboard

> **Agentic-Hackathon Lauf #4** — UI-Tool für VNB/Netzbetreiber zur Versorgungsdokumentation.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-GitHub_Pages-e8b339)](https://energychain.github.io/cernion-vdmi-dashboard)
[![Cernion](https://img.shields.io/badge/Powered_by-Cernion_a²mdm-16213e)](https://github.com/energychain/cernion-energy-tools)
[![License](https://img.shields.io/badge/License-AGPL--3.0-blue)](LICENSE)

---

## 🎯 Der Use Case

**Medien-Anker:** BNetzA verschärft Kontrollen bei Verteilnetzbetreibern — VDMI-Lücken können zu Bußgeldern führen.

> **„Als Netzbetreiber muss ich jederzeit wissen: Ist meine Versorgungsdokumentation (VDMI) vollständig? Welche Findings sind offen? Wann läuft die nächste Deadline ab?“**

---

## 🖥️ Was das Tool zeigt

| Feature | Beschreibung |
|---------|-------------|
| **Audit-Score** | KPI-Karte mit Gesamtbewertung (0–100) |
| **Findings-Trend** | Gestapeltes Balkendiagramm: Offen vs. Geschlossen über 5 Monate |
| **Kategorie-Verteilung** | Doughnut-Chart: Messung, Abrechnung, Stammdaten, Netzbetrieb, Redispatch |
| **Findings-Tabelle** | 15 Findings mit Filter (Severity + Status), sortierbar |
| **Fristen-Tracking** | Nächste Deadline prominent angezeigt |

---

## 🏗️ Technischer Stack

| Ebene | Technologie |
|-------|------------|
| **Frontend** | HTML5 + CSS3 + ES6 (Vanilla) |
| **Styling** | [Pico.css](https://picocss.com) |
| **Charts** | [Chart.js](https://chartjs.org) |
| **Backend** | Cernion a²mdm API (`/api/vdmi`) |
| **Hosting** | GitHub Pages |

---

## 🚀 Schnellstart

### 1. Live-Demo
👉 **[energychain.github.io/cernion-vdmi-dashboard](https://energychain.github.io/cernion-vdmi-dashboard)**

### 2. Lokal
```bash
git clone https://github.com/energychain/cernion-vdmi-dashboard.git
cd cernion-vdmi-dashboard
# index.html im Browser öffnen
```

---

## 💡 Der Cernion-Mehrwert

| Ohne Cernion | Mit Cernion a²mdm |
|-------------|-------------------|
| Manuelle VDMI-Listen in Excel | **Eine API** — alle Findings zentralisiert und tenant-isoliert |
| Keine Echtzeit-Sicht auf Audit-Score | **Automatische Berechnung** aus synchronisierten Zeitreihen |
| Findings verstreut in E-Mails | **Strukturierte Findings** mit Code, Severity, Frist, Zuständigem |
| Keine Trend-Analyse | **5-Monats-Trend** direkt aus der Datenbank |

---

## 📊 Demo-Daten

### Audit-Status
| Attribut | Wert |
|----------|------|
| **Audit-Score** | 72/100 |
| **Letzter Audit** | 10.05.2026 (TÜV Rheinland Energie) |
| **Nächste Deadline** | 15.06.2026 |
| **Gesamt-Findings** | 15 |

### Findings-Verteilung
| Severity | Anzahl | Status |
|----------|--------|--------|
| Kritisch (error) | 2 | Offen |
| Warning | 5 | 2 Offen, 3 In Bearbeitung |
| Info | 8 | 4 Geschlossen, 3 In Bearbeitung, 1 Offen |

---

## 📄 Lizenz

AGPL-3.0 — wie [cernion-energy-tools](https://github.com/energychain/cernion-energy-tools).

---

## 👤 Autor

**Cernion Agentic Hackathon 2026** — Thorsten Zörner & Hermes Agent.  
Betrieben von [STROMDAO GmbH](https://stromdao.com).
