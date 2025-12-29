function renderQueryEfficiency(data, root) {

  // ===== Campaign Summary Benchmarks =====
  const totalViews = data.reduce((a, b) => a + (b.Views || 0), 0);
  const totalClicks = data.reduce((a, b) => a + (b.Clicks || 0), 0);

  const totalUnits =
    data.reduce((a, b) => a + (b[" Direct Units Sold"] || 0), 0) +
    data.reduce((a, b) => a + (b["Indirect Units Sold"] || 0), 0);

  const summaryCTR = totalViews ? (totalClicks / totalViews) * 100 : 0;
  const summaryCVR = totalClicks ? (totalUnits / totalClicks) * 100 : 0;

  // ===== Prepare Rows =====
  let rows = data.map(r => {

    const adsSpend = r["SUM(cost)"] || 0;

    const totalUnitsSold =
      (r[" Direct Units Sold"] || 0) + (r["Indirect Units Sold"] || 0);

    const totalRevenue =
      (r["Direct Revenue"] || 0) + (r["Indirect Revenue"] || 0);

    const ctr = r.Views ? (r.Clicks / r.Views) * 100 : 0;
    const cvr = r.Clicks ? (totalUnitsSold / r.Clicks) * 100 : 0;

    const assistPct = totalRevenue
      ? (r["Indirect Revenue"] / totalRevenue) * 100
      : 0;

    // ===== Remarks Logic (LOCKED) =====
    let remarks = "Still Safe";
    let color = "#f59e0b";

    if (adsSpend === 0) {
      remarks = "Still Safe";
      color = "#f59e0b";
    }
    else if (adsSpend > 0 && adsSpend < 100 && totalRevenue === 0) {
      remarks = "Negative";
      color = "#dc2626";
    }
    else if (r.ROI > 7) {
      remarks = "Good";
      color = "#16a34a";
    }
    else if (
      ctr < summaryCTR * 0.5 ||
      cvr < summaryCVR * 0.5
    ) {
      remarks = "Review";
      color = "#f59e0b";
    }

    return {
      Keyword: r.Query,
      Views: r.Views || 0,
      Clicks: r.Clicks || 0,
      "CTR %": ctr.toFixed(2),
      "CVR %": cvr.toFixed(2),
      "Average Bid": (r["Average CPC"] || 0).toFixed(2),
      "Ads Spend": adsSpend.toFixed(0),
      "Total Units Sold": totalUnitsSold,
      "Total Revenue": totalRevenue.toFixed(0),
      "Assist %": assistPct.toFixed(2),
      ROI: (r.ROI || 0).toFixed(2),
      Remarks: remarks,
      _color: color
    };
  });

  // ===== Sort =====
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
      <div id="qp-controls" style="text-align:center; margin-top:12px;"></div>
    </div>
  `;

  // ===== EXPORT FUNCTION =====
  function exportExcel() {
    const headers = Object.keys(rows[0]).filter(k => k !== "_color");
    const csv = [
      headers.join(","),
      ...rows.map(r => headers.map(h => r[h]).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "application/vnd.ms-excel" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Query_Performance_Efficiency.xlsx";
    link.click();
  }

  // ===== Render Table =====
  function renderTable() {
    const container = card.querySelector("#qp-table-container");
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
                <td style="text-align:center; color:${k === "Remarks" ? r._color : "inherit"}">
                  ${r[k]}
                </td>`).join("")}
          </tr>`).join("")}
      </table>
    `;

    const controls = card.querySelector("#qp-controls");

    if (visibleCount >= rows.length) {
      controls.innerHTML = `
        <button id="qp-top">Top 25</button>
        <button id="qp-collapse">Collapse All</button>
        <button id="qp-export">Export</button>
      `;

      controls.querySelector("#qp-top").onclick = () => {
        visibleCount = 25;
        renderTable();
        container.scrollIntoView({ behavior: "smooth" });
      };

      controls.querySelector("#qp-collapse").onclick = () => {
        card.querySelector(".report-body").style.display = "none";
        card.querySelector(".toggle-icon").textContent = "▸";
      };

      controls.querySelector("#qp-export").onclick = exportExcel;

    } else {
      controls.innerHTML = `
        <button id="qp-show-more">Show More</button>
        <button id="qp-export">Export</button>
      `;

      controls.querySelector("#qp-show-more").onclick = () => {
        visibleCount += 25;
        renderTable();
      };

      controls.querySelector("#qp-export").onclick = exportExcel;
    }
  }

  renderTable();

  card.querySelector(".report-header").onclick = function () {
    toggleByHeader(this);
  };

  root.appendChild(card);
}
