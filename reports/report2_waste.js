function renderWasteReport(data, root) {

  // ===== Prepare Rows =====
  let rows = data.map(r => {

    const views = r.Views || 0;
    const clicks = r.Clicks || 0;
    const adsSpend = r["SUM(cost)"] || 0;

    const directUnits = r[" Direct Units Sold"] || 0;
    const indirectUnits = r["Indirect Units Sold"] || 0;
    const totalUnitsSold = directUnits + indirectUnits;

    const directRevenue = r["Direct Revenue"] || 0;
    const indirectRevenue = r["Indirect Revenue"] || 0;
    const totalRevenue = directRevenue + indirectRevenue;

    const ctr = views ? (clicks / views) * 100 : 0;
    const cvr = clicks ? (totalUnitsSold / clicks) * 100 : 0;

    const assistPct = totalUnitsSold
      ? (indirectUnits / totalUnitsSold) * 100
      : 0;

    const roi = r.ROI || 0;

    // ===== ACTION LOGIC =====
    let action = "Active";
    let color = "#16a34a"; // Green

    if (
      (clicks > 50 && adsSpend < 100) ||
      (totalUnitsSold <= 0 && adsSpend < 500) ||
      (adsSpend > 500 && roi < 3)
    ) {
      action = "Pause";
      color = "#dc2626"; // Red
    }

    return {
      Keyword: r.Query,
      Views: views,
      Clicks: clicks,
      "CTR %": ctr.toFixed(2),
      "CVR %": cvr.toFixed(2),
      "Ads Spend": adsSpend.toFixed(0),
      "Units Sold": totalUnitsSold,
      Revenue: totalRevenue.toFixed(0),
      ROI: roi.toFixed(2),
      "Assist %": assistPct.toFixed(2),
      Action: action,
      _color: color
    };
  });

  // ===== Sort: Highest Spend First (optional but useful) =====
  rows.sort((a, b) => b["Ads Spend"] - a["Ads Spend"]);

  let visibleCount = 25;

  const card = document.createElement("div");
  card.className = "report-card";

  card.innerHTML = `
    <div class="report-header">
      <div>2️⃣ Waste Analysis</div>
      <span class="toggle-icon">▸</span>
    </div>

    <div class="report-body">
      <div id="wa-table-container"></div>
      <div id="wa-controls" style="text-align:center; margin-top:12px;"></div>
    </div>
  `;

  // ===== CSV EXPORT =====
  function exportCSV() {
    const headers = Object.keys(rows[0]).filter(k => k !== "_color");
    const csv = [
      headers.join(","),
      ...rows.map(r => headers.map(h => `"${r[h]}"`).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Waste_Analysis.csv";
    link.click();
  }

  // ===== Render Table =====
  function renderTable() {
    const container = card.querySelector("#wa-table-container");
    const displayRows = rows.slice(0, visibleCount);

    container.innerHTML = `
      <table>
        <tr>
          ${Object.keys(rows[0])
            .filter(k => k !== "_color")
            .map(h => `<th style="text-align:center">${h}</th>`).join("")}
        </tr>

        ${displayRows.map(r => `
          <tr>
            ${Object.keys(r)
              .filter(k => k !== "_color")
              .map(k => `
                <td style="text-align:center; color:${k === "Action" ? r._color : "inherit"}">
                  ${r[k]}
                </td>`).join("")}
          </tr>
        `).join("")}
      </table>
    `;

    const controls = card.querySelector("#wa-controls");

    if (visibleCount >= rows.length) {
      controls.innerHTML = `
        <button id="wa-top">Top 25</button>
        <button id="wa-collapse">Collapse All</button>
        <button id="wa-export">Export CSV</button>
      `;

      controls.querySelector("#wa-top").onclick = () => {
        visibleCount = 25;
        renderTable();
        container.scrollIntoView({ behavior: "smooth" });
      };

      controls.querySelector("#wa-collapse").onclick = () => {
        card.querySelector(".report-body").style.display = "none";
        card.querySelector(".toggle-icon").textContent = "▸";
      };

      controls.querySelector("#wa-export").onclick = exportCSV;

    } else {
      controls.innerHTML = `
        <button id="wa-show-more">Show More</button>
        <button id="wa-export">Export CSV</button>
      `;

      controls.querySelector("#wa-show-more").onclick = () => {
        visibleCount += 25;
        renderTable();
      };

      controls.querySelector("#wa-export").onclick = exportCSV;
    }
  }

  renderTable();

  card.querySelector(".report-header").onclick = function () {
    toggleByHeader(this);
  };

  root.appendChild(card);
}
