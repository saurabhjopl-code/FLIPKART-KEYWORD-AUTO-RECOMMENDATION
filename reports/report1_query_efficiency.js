function renderQueryEfficiency(data, root) {

  // ===== HELPER: FIND COLUMN BY PARTIAL NAME =====
  function getValueByContains(row, text) {
    const key = Object.keys(row).find(k =>
      k.replace(/\s+/g, " ").trim().toLowerCase()
        .includes(text.toLowerCase())
    );
    return key ? Number(row[key]) || 0 : 0;
  }

  // ===== Campaign Summary Benchmarks (LOCKED) =====
  const totalViews = data.reduce((a, b) => a + (b.Views || 0), 0);
  const totalClicks = data.reduce((a, b) => a + (b.Clicks || 0), 0);

  const summaryTotalUnits = data.reduce((sum, r) => {
    const d = getValueByContains(r, "direct units sold");
    const i = getValueByContains(r, "indirect units sold");
    return sum + d + i;
  }, 0);

  const summaryCTR = totalViews ? (totalClicks / totalViews) * 100 : 0;
  const summaryCVR = totalClicks
    ? (summaryTotalUnits / totalClicks) * 100
    : 0;

  // ===== PREPARE ROWS (FIXED FOR REAL) =====
  let rows = data.map(r => {

    const directUnits = getValueByContains(r, "direct units sold");
    const indirectUnits = getValueByContains(r, "indirect units sold");

    const totalUnitsSold = directUnits + indirectUnits;

    const totalRevenue =
      getValueByContains(r, "direct revenue") +
      getValueByContains(r, "indirect revenue");

    const ctr = r.Views ? (r.Clicks / r.Views) * 100 : 0;
    const cvr = r.Clicks ? (totalUnitsSold / r.Clicks) * 100 : 0;

    const assistPct = totalUnitsSold > 0
      ? (indirectUnits / totalUnitsSold) * 100
      : 0;

    const adsSpend = getValueByContains(r, "cost");

    // ===== REMARKS LOGIC (LOCKED) =====
    let remarks = "Still Safe";
    let color = "#f59e0b";

    if (adsSpend === 0) {
      remarks = "Still Safe";
    }
    else if (adsSpend > 0 && adsSpend < 100 && totalRevenue === 0) {
      remarks = "Negative";
      color = "#dc2626";
    }
    else if ((r.ROI || 0) > 7) {
      remarks = "Good";
      color = "#16a34a";
    }
    else if (
      ctr < summaryCTR * 0.5 ||
      cvr < summaryCVR * 0.5
    ) {
      remarks = "Review";
    }

    return {
      Keyword: r.Query,
      Views: r.Views || 0,
      Clicks: r.Clicks || 0,
      "CTR %": ctr.toFixed(2),
      "CVR %": cvr.toFixed(2),
      "Average Bid": (r["Average CPC"] || 0).toFixed(2),
      "Ads Spend": adsSpend.toFixed(0),
      "Total Units Sold": totalUnitsSold,      // ✅ NOW CORRECT
      "Total Revenue": totalRevenue.toFixed(0),
      "Assist %": assistPct.toFixed(2),        // ✅ NOW CORRECT
      ROI: (r.ROI || 0).toFixed(2),
      Remarks: remarks,
      _color: color
    };
  });

  // ===== SORT (LOCKED) =====
  rows.sort((a, b) => b.Views - a.Views);

  let visibleCount = 25;

  const card = document.createElement("div");
  card.className = "report-card";

  card.innerHTML = `
    <div class="report-header">
      <div>1️⃣ Query Performance Efficiency</div>
      <span class="toggle-icon">▸</span>
    </div>
    <div class="report-body">
      <div id="qp-table-container"></div>
      <div id="qp-controls" style="text-align:center;margin-top:12px;"></div>
    </div>
  `;

  function exportCSV() {
    const headers = Object.keys(rows[0]).filter(k => k !== "_color");
    const csv = [
      headers.join(","),
      ...rows.map(r => headers.map(h => `"${r[h]}"`).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Query_Performance_Efficiency.csv";
    link.click();
  }

  function renderTable() {
    const container = card.querySelector("#qp-table-container");
    const displayRows = rows.slice(0, visibleCount);

    container.innerHTML = `
      <table>
        <tr>
          ${Object.keys(displayRows[0])
            .filter(k => k !== "_color")
            .map(h => `<th style="text-align:center">${h}</th>`)
            .join("")}
        </tr>
        ${displayRows.map(r => `
          <tr>
            ${Object.keys(r)
              .filter(k => k !== "_color")
              .map(k => `
                <td style="text-align:center;color:${k==="Remarks"?r._color:"inherit"}">
                  ${r[k]}
                </td>`).join("")}
          </tr>`).join("")}
      </table>
    `;

    const controls = card.querySelector("#qp-controls");

    if (visibleCount >= rows.length) {
      controls.innerHTML = `
        <button onclick="(${exportCSV.toString()})()">Export CSV</button>
      `;
    } else {
      controls.innerHTML = `
        <button onclick="visibleCount+=25;renderTable()">Show More</button>
        <button onclick="(${exportCSV.toString()})()">Export CSV</button>
      `;
    }
  }

  renderTable();
  root.appendChild(card);
}
