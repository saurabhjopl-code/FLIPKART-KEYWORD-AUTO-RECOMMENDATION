function renderAssistedReport(data, root) {

  function getValueByContains(row, text) {
    const key = Object.keys(row).find(k =>
      k.replace(/\s+/g, " ").trim().toLowerCase()
        .includes(text.toLowerCase())
    );
    return key ? Number(row[key]) || 0 : 0;
  }

  let rows = data
    .map(r => {

      const views = r.Views || 0;
      const clicks = r.Clicks || 0;

      const directUnits = getValueByContains(r, "direct units sold");
      const indirectUnits = getValueByContains(r, "indirect units sold");

      const indirectRevenue = getValueByContains(r, "indirect revenue");

      const totalUnits = directUnits + indirectUnits;

      const ctr = views ? (clicks / views) * 100 : 0;
      const cvr = clicks ? (totalUnits / clicks) * 100 : 0;

      const assistPct = totalUnits
        ? (indirectUnits / totalUnits) * 100
        : 0;

      let remarks = "No Assist";
      let color = "#dc2626";

      if (assistPct > 50) {
        remarks = "Heavy Assist"; color = "#16a34a";
      } else if (assistPct > 30) {
        remarks = "Mid Assist"; color = "#f59e0b";
      } else if (assistPct > 0) {
        remarks = "Low Assist"; color = "#fb923c";
      }

      return {
        Keyword: r.Query,
        Views: views,
        Clicks: clicks,
        "CTR %": ctr.toFixed(2),
        "CVR %": cvr.toFixed(2),
        "Direct Units": directUnits,
        "Indirect Units": indirectUnits,
        "Assist %": assistPct.toFixed(2),
        Remarks: remarks,
        _color: color,
        _indirectRevenue: indirectRevenue
      };
    })
    // 🔒 HARD FILTER (LOCKED)
    .filter(r => r._indirectRevenue > 0);

  rows.sort((a, b) => b["Assist %"] - a["Assist %"]);

  let visibleCount = 25;

  const card = document.createElement("div");
  card.className = "report-card";

  card.innerHTML = `
    <div class="report-header">
      <div>3️⃣ Assisted / Halo Sales</div>
      <span class="toggle-icon">▸</span>
    </div>
    <div class="report-body">
      <div id="as-table-container"></div>
      <div id="as-controls" style="text-align:center;margin-top:12px;"></div>
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
    link.download = "Assisted_Halo_Sales.csv";
    link.click();
  }

  function renderTable() {
    const c = card.querySelector("#as-table-container");
    const rowsToShow = rows.slice(0, visibleCount);

    c.innerHTML = `
      <table>
        <tr>${Object.keys(rowsToShow[0]).filter(k=>!k.startsWith("_"))
          .map(h=>`<th style="text-align:center">${h}</th>`).join("")}</tr>
        ${rowsToShow.map(r=>`
          <tr>${Object.keys(r).filter(k=>!k.startsWith("_"))
            .map(k=>`<td style="text-align:center;color:${k==="Remarks"?r._color:"inherit"}">${r[k]}</td>`).join("")}
          </tr>`).join("")}
      </table>
    `;

    const ctrl = card.querySelector("#as-controls");
    ctrl.innerHTML = visibleCount >= rows.length
      ? `<button onclick="(${exportCSV.toString()})()">Export CSV</button>`
      : `<button onclick="visibleCount+=25;renderTable()">Show More</button>
         <button onclick="(${exportCSV.toString()})()">Export CSV</button>`;
  }

  renderTable();
  root.appendChild(card);
}
