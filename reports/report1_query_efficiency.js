function renderQueryEfficiency(data, root) {

  // ---------- SUMMARY BENCHMARKS (from Campaign Summary logic) ----------
  const totalViews = data.reduce((a, b) => a + (b.Views || 0), 0);
  const totalClicks = data.reduce((a, b) => a + (b.Clicks || 0), 0);
  const totalUnits =
    data.reduce((a, b) => a + (b[" Direct Units Sold"] || 0), 0) +
    data.reduce((a, b) => a + (b["Indirect Units Sold"] || 0), 0);

  const summaryCTR = totalViews ? (totalClicks / totalViews) * 100 : 0;
  const summaryCVR = totalClicks ? (totalUnits / totalClicks) * 100 : 0;

  // ---------- PREPARE ROWS ----------
  const rows = data.map(r => {
    const totalUnitsSold =
      (r[" Direct Units Sold"] || 0) + (r["Indirect Units Sold"] || 0);

    const totalRevenue =
      (r["Direct Revenue"] || 0) + (r["Indirect Revenue"] || 0);

    const ctr = r.Views ? (r.Clicks / r.Views) * 100 : 0;
    const cvr = r.Clicks ? (totalUnitsSold / r.Clicks) * 100 : 0;

    const assistPct = totalRevenue
      ? (r["Indirect Revenue"] / totalRevenue) * 100
      : 0;

    let remarks = "Good";

    // Rule 1: Low spend + zero revenue
    if (r["SUM(cost)"] < 100 && totalRevenue === 0) {
      remarks = "Negative";
    }

    // Rule 2: CTR / CVR below 50% of summary benchmark
    if (
      ctr < summaryCTR * 0.5 ||
      cvr < summaryCVR * 0.5
    ) {
      remarks = "Review";
    }

    // Rule 3: ROI below 7
    if (r.ROI < 7) {
      remarks = "Review";
    }

    return {
      keyword: r.Query,
      views: r.Views || 0,
      clicks: r.Clicks || 0,
      ctr,
      cvr,
      adsSpend: r["SUM(cost)"] || 0,
      totalUnitsSold,
      totalRevenue,
      assistPct,
      roi: r.ROI || 0,
      remarks
    };
  });

  // ---------- SORT: Views High → Low ----------
  rows.sort((a, b) => b.views - a.views);

  // ---------- RENDER ----------
  const card = document.createElement("div");
  card.className = "report-card";

  card.innerHTML = `
    <div class="report-header">
      <div>1️⃣ Query Performance Efficiency</div>
      <span class="toggle-icon">▸</span>
    </div>

    <div class="report-body">
      <table>
        <tr>
          <th style="text-align:center">Keyword</th>
          <th style="text-align:center">Views</th>
          <th style="text-align:center">Clicks</th>
          <th style="text-align:center">CTR %</th>
          <th style="text-align:center">CVR %</th>
          <th style="text-align:center">Ads Spend</th>
          <th style="text-align:center">Total Units Sold</th>
          <th style="text-align:center">Total Revenue</th>
          <th style="text-align:center">Assist %</th>
          <th style="text-align:center">ROI</th>
          <th style="text-align:center">Remarks</th>
        </tr>

        ${rows.map(r => `
          <tr>
            <td style="text-align:center">${r.keyword}</td>
            <td style="text-align:center">${r.views}</td>
            <td style="text-align:center">${r.clicks}</td>
            <td style="text-align:center">${r.ctr.toFixed(2)}%</td>
            <td style="text-align:center">${r.cvr.toFixed(2)}%</td>
            <td style="text-align:center">₹${r.adsSpend.toFixed(0)}</td>
            <td style="text-align:center">${r.totalUnitsSold}</td>
            <td style="text-align:center">₹${r.totalRevenue.toFixed(0)}</td>
            <td style="text-align:center">${r.assistPct.toFixed(2)}%</td>
            <td style="text-align:center">${r.roi.toFixed(2)}</td>
            <td style="text-align:center">${r.remarks}</td>
          </tr>
        `).join("")}
      </table>
    </div>
  `;

  card.querySelector(".report-header").onclick = function () {
    toggleByHeader(this);
  };

  root.appendChild(card);
}
