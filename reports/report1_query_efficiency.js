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

    // ===== DEFAULT =====
    let remarks = "Still Safe";
    let color = "#f59e0b"; // Amber

    // 🔒 RULE 0 — ZERO SPEND OVERRIDE (TOP PRIORITY)
    if (adsSpend === 0) {
      remarks = "Still Safe";
      color = "#f59e0b";
    }
    // 🔴 RULE 1 — ONLY NEGATIVE CASE
    else if (adsSpend > 0 && adsSpend < 100 && totalRevenue === 0) {
      remarks = "Negative";
      color = "#dc2626"; // Red
    }
    // 🟢 RULE 2 — GOOD
    else if (r.ROI > 7) {
      remarks = "Good";
      color = "#16a34a"; // Green
    }
    // 🟠 RULE 3 — REVIEW
    else if (
      ctr < summaryCTR * 0.5 ||
      cvr < summaryCVR * 0.5
    ) {
      remarks = "Review";
      color = "#f59e0b"; // Amber
    }

    return {
      keyword: r.Query,
      views: r.Views || 0,
      clicks: r.Clicks || 0,
      ctr,
      cvr,
      avgBid: r["Average CPC"] || 0,
      adsSpend,
      totalUnitsSold,
      totalRevenue,
      assistPct,
      roi: r.ROI || 0,
      remarks,
      color
    };
  });

  // ===== Sort: Views High → Low =====
  rows.sort((a, b) => b.views - a.views);

  // ===== Pagination =====
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

  function renderTable() {
    const container = card.querySelector("#qp-table-container");
    const displayRows = rows.slice(0, visibleCount);

    container.innerHTML = `
      <table>
        <tr>
          <th style="text-align:center">Keyword</th>
          <th style="text-align:center">Views</th>
          <th style="text-align:center">Clicks</th>
          <th style="text-align:center">CTR %</th>
          <th style="text-align:center">CVR %</th>
          <th style="text-align:center">Average Bid</th>
          <th style="text-align:center">Ads Spend</th>
          <th style="text-align:center">Total Units Sold</th>
          <th style="text-align:center">Total Revenue</th>
          <th style="text-align:center">Assist %</th>
          <th style="text-align:center">ROI</th>
          <th style="text-align:center">Remarks</th>
        </tr>

        ${displayRows.map(r => `
          <tr>
            <td style="text-align:center">${r.keyword}</td>
            <td style="text-align:center">${r.views}</td>
            <td style="text-align:center">${r.clicks}</td>
            <td style="text-align:center">${r.ctr.toFixed(2)}%</td>
            <td style="text-align:center">${r.cvr.toFixed(2)}%</td>
            <td style="text-align:center">₹${r.avgBid.toFixed(2)}</td>
            <td style="text-align:center">₹${r.adsSpend.toFixed(0)}</td>
            <td style="text-align:center">${r.totalUnitsSold}</td>
            <td style="text-align:center">₹${r.totalRevenue.toFixed(0)}</td>
            <td style="text-align:center">${r.assistPct.toFixed(2)}%</td>
            <td style="text-align:center">${r.roi.toFixed(2)}</td>
            <td style="text-align:center; font-weight:600; color:${r.color}">
              ${r.remarks}
            </td>
          </tr>
        `).join("")}
      </table>
    `;

    const controls = card.querySelector("#qp-controls");

    if (visibleCount >= rows.length) {
      controls.innerHTML = `
        <button id="qp-top">Top 25</button>
        <button id="qp-collapse">Collapse All</button>
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
    } else {
      controls.innerHTML = `<button id="qp-show-more">Show More</button>`;
      controls.querySelector("#qp-show-more").onclick = () => {
        visibleCount += 25;
        renderTable();
      };
    }
  }

  renderTable();

  card.querySelector(".report-header").onclick = function () {
    toggleByHeader(this);
  };

  root.appendChild(card);
}
