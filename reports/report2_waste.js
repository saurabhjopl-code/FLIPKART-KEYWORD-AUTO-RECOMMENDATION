function renderWasteReport(data, root) {

  function getValueByContains(row, text) {
    const key = Object.keys(row).find(k =>
      k.replace(/\s+/g, " ").trim().toLowerCase()
        .includes(text.toLowerCase())
    );
    return key ? Number(row[key]) || 0 : 0;
  }

  // ===== BUILD + FILTER HARD WASTE ROWS (LOCKED LOGIC) =====
  let rows = data
    .map(r => {

      const views = r.Views || 0;
      const clicks = r.Clicks || 0;
      const adsSpend = getValueByContains(r, "cost");

      const directUnits = getValueByContains(r, "direct units sold");
      const indirectUnits = getValueByContains(r, "indirect units sold");
      const totalUnitsSold = directUnits + indirectUnits;

      const totalRevenue =
        getValueByContains(r, "direct revenue") +
        getValueByContains(r, "indirect revenue");

      const ctr = views ? (clicks / views) * 100 : 0;
      const cvr = clicks ? (totalUnitsSold / clicks) * 100 : 0;

      const assistPct = totalUnitsSold
        ? (indirectUnits / totalUnitsSold) * 100
        : 0;

      return {
        Keyword: r.Query,
        Views: views,
        Clicks: clicks,
        "CTR %": ctr.toFixed(2),
        "CVR %": cvr.toFixed(2),
        "Ads Spend": adsSpend.toFixed(0),
        "Units Sold": totalUnitsSold,
        Revenue: totalRevenue.toFixed(0),
        ROI: (r.ROI || 0).toFixed(2),
        "Assist %": assistPct.toFixed(2),
        Action: "Bad",
        _adsSpend: adsSpend,
        _revenue: totalRevenue
      };
    })
    // 🔒 HARD FILTER (LOCKED)
    .filter(r =>
      r._adsSpend > 0 &&
      r._adsSpend < 100 &&
      r._revenue === 0
    );

  rows.sort((a, b) => b["Ads Spend"] - a["Ads Spend"]);

  let visibleCount = 25;

  const card = document.createElement("div");
  card.className = "report-card";

  card.innerHTML = `
    <div class="report-header">
      <div>2️⃣ Waste Analysis (Hard Bad Keywords)</div>
      <span class="toggle-icon">▸</span>
    </div>
    <div class="report-body">
      <div id="wa-table-container"></div>
      <div id="wa-controls" style="text-align:center;margin-top:12px;"></div>
    </div>
  `;

  function exportCSV() {
    if (!rows.length) return;
    const headers = Object.keys(rows[0]).filter(k => !k.startsWith("_"));
    const csv = [
      headers.join(","),
      ...rows.map(r => headers.map(h => `"${r[h]}"`).join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Waste_Bad_Keywords.csv";
    link.click();
  }

  function renderTable() {
    const c = card.querySelector("#wa-table-container");
    const rowsToShow = rows.slice(0, visibleCount);

    if (!rows.length) {
      c.innerHTML = `<p style="text-align:center">🎉 No bad keywords found.</p>`;
      return;
    }

    c.innerHTML = `
      <table>
        <tr>${Object.keys(rowsToShow[0]).filter(k=>!k.startsWith("_"))
          .map(h=>`<th style="text-align:center">${h}</th>`).join("")}</tr>
        ${rowsToShow.map(r=>`
          <tr>${Object.keys(r).filter(k=>!k.startsWith("_"))
            .map(k=>`<td style="text-align:center;color:${k==="Action"?"#dc2626":"inherit"}">${r[k]}</td>`).join("")}
          </tr>`).join("")}
      </table>
    `;

    const ctrl = card.querySelector("#wa-controls");
    ctrl.innerHTML = visibleCount >= rows.length
      ? `<button onclick="(${exportCSV.toString()})()">Export CSV</button>`
      : `<button onclick="visibleCount+=25;renderTable()">Show More</button>
         <button onclick="(${exportCSV.toString()})()">Export CSV</button>`;
  }

  renderTable();
  root.appendChild(card);
}
