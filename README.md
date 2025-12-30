# Flipkart Keyword Auto Recommendation Tool

A browser-based analytics tool for Flipkart Ads keyword analysis.
Built using **HTML + CSS + JavaScript**, hosted on **GitHub Pages**.

## 🚀 Live App
https://saurabhjopl-code.github.io/FLIPKART-KEYWORD-AUTO-RECOMMENDATION/

## 📂 Input File Format
Upload Flipkart Ads keyword report CSV with:
- Row 1: Start Date
- Row 2: End Date
- Row 3+: Data rows

Required headers (unchanged):
- Query
- Views
- Clicks
- Average CPC
- Direct Units Sold
- Indirect Units Sold
- Direct Revenue
- Indirect Revenue
- ROI
- SUM(cost)

Header spacing/casing does NOT matter.

---

## 📊 Reports Included (v12.30)

1. **Campaign Summary**
2. **Query Performance Efficiency**
3. **Waste Keywords**
4. **Assisted / Halo Sales**
5. **Scale Opportunities**
6. **Bidding Health**
7. **Query Maturity**

Each report supports:
- Expand / Collapse
- Pagination
- CSV Export

---

## 📦 Export
- Export individual reports as CSV
- Export **all reports as ZIP bundle** (separate CSV per report)

---

## 🛠 Tech Stack
- Vanilla JavaScript
- No backend
- No dependencies (except JSZip for ZIP export)

---

## ⚠️ Notes
- All business logic is frozen as of **v12.30**
- This tool performs **client-side analysis only**
- No data is uploaded or stored externally

---

## 📄 License
MIT License

Built for Flipkart performance marketers.
