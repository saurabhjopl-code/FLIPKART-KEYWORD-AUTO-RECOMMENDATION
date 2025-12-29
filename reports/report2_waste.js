function renderWasteReport(data, root) {

  // ===== BUILD + FILTER HARD WASTE ROWS =====
  let rows = data
    .map(r => {

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

      return {
        Keyword: r.Query,
        Views: views,
        Clicks: clicks,
        "CTR %": ctr,
        "CVR %": cvr,
        "Ads Spend": adsSpend,
        "Units Sold": totalUnitsSold,
        Revenue: totalRevenue,
        ROI: r.ROI || 0,
        "Assist %": assistPct,
        Action: "Bad",
        _adsSpend: adsSpend,
        _revenue: totalRevenue
      };
    })
    // 🔒 HARD FILTER (FINAL)
    .filter(r =>
      r._adsSpend > 0 &&
      r._adsSpend < 100 &&
      r._revenue === 0
    );

  // ===== SORT: HIGHEST SPEND FIRST =====
  rows.sort((a, b) => b["Ads Spend"] - a["Ads Spend"]);

  // ===== SUMMARY CALCULATION =====
  const summary = rows.reduce((acc, r) => {
    acc.views += r.Views;
    acc.clicks += r.Clicks;
    acc.spend += r["Ads Spend"];
    return acc;
  }, { views: 0, clicks: 0, spend: 0 });

  const summaryCTR = summary.views
    ? (summary.clicks / summary.views) * 100
    : 0;

  const summaryCVR = summary.clicks
    ? 0
    : 0;

  let visibleCount = 25;

  const card = document.createElement("div");
  card.className = "report-card";

  card.innerHTML = `
    <div class="report-header">
      <div>2️⃣ Waste Analysis (Hard Bad Keywords)</div>
      <span class="toggle-icon">▸</span>
    </div>

    <div class="report-body">

      <!-- SUMMARY TABLE -->
      <table style="margin-bottom:16px;">
        <tr>
          <th style="text-align:center">Views</th>
          <th style="text-align:center">Clicks</th>
          <th style="text-align:center">CTR %</th>
          <th style="text-align:center">CVR %</th>
          <th style="text-align:center">Ads Spend (Possible Saving)</th>
        </tr>
        <tr>
          <td style="text-align:center">${summary.views}</td>
          <td style="text-align:center">${summary.clicks}</td>
          <td style="text-align:center">${summaryCTR.toFixed(2)}%</td>
          <td style="text-align:center">${summaryCVR.toFixed(2)}%</td>
          <td style="text-align:center">₹${summary.spend.toFixed(0)}</td>
        </tr>
      </table>

      <!-- DETAIL TABLE -->
      <div id="wa-table-container"></div>
      <div id="wa-controls" style="text-align:center; margin-top:12px;"></div>
    </div>
  `;

  // ===== CSV EXPORT =====
  function exportCSV() {
    if (rows.length === 0) return;

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

  // ===== RENDER DETAIL TABLE =====
  function renderTable() {
    const container = card.querySelector("#wa-table-container");
    const displayRows = rows.slice(0, visibleCount);

    if (rows.length === 0) {
      container.innerHTML = `<p style="text-align:center">🎉 No bad keywords found.</p>`;
      card.querySelector("#wa-controls").innerHTML = "";
      return;
    }

    container.innerHTML = `
      <table>
        <tr>
          ${Object.keys(displayRows[0])
            .filter(k => !k.startsWith("_"))
            .map(h => `<th style="text-align:center">${h}</th>`)
            .join("")}
        </tr>

        ${displayRows.map(r => `
          <tr>
            ${Object.keys(r)
              .filter(k => !k.startsWith("_"))
              .map(k => `
                <td style="text-align:center; color:${k === "Action" ? "#dc2626" : "inherit"}">
                  ${typeof r[k] === "number" ? r[k].toFixed(0) : r[k]}
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
