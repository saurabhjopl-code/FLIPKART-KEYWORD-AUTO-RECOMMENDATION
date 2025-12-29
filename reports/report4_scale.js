function renderScaleReport(data, root) {

  // ===== HEADER-AGNOSTIC VALUE RESOLVER =====
  function getValueByContains(row, text) {
    const key = Object.keys(row).find(k =>
      k.replace(/\s+/g, " ")
        .trim()
        .toLowerCase()
        .includes(text.toLowerCase())
    );
    return key ? Number(row[key]) || 0 : 0;
  }

  // ===== BUILD SCALE ROWS =====
  let rows = data
    .map(r => {

      const views = r.Views || 0;
      const clicks = r.Clicks || 0;

      if (clicks < 1) return null;

      const directUnits = getValueByContains(r, "direct units sold");
      const indirectUnits = getValueByContains(r, "indirect units sold");
      const totalUnits = directUnits + indirectUnits;

      const revenue =
        getValueByContains(r, "direct revenue") +
        getValueByContains(r, "indirect revenue");

      const adsSpend = getValueByContains(r, "cost");
      const roi = adsSpend ? revenue / adsSpend : 0;

      const ctr = views ? (clicks / views) * 100 : 0;
      const cvr = clicks ? (totalUnits / clicks) * 100 : 0;

      let recommendation = "Watch";
      let color = "#f59e0b";

      if (
        clicks >= 50 &&
        revenue > 0 &&
        roi >= 5 &&
        cvr >= 2
      ) {
        recommendation = "Scale";
        color = "#16a34a";
      }

      return {
        Keyword: r.Query,
        Views: views,
        Clicks: clicks,
        "CTR %": ctr.toFixed(2),
        "CVR %": cvr.toFixed(2),
        "Ads Spend": adsSpend.toFixed(0),
        "Total Units Sold": totalUnits,
        "Total Revenue": revenue.toFixed(0),
        ROI: roi.toFixed(2),
        Recommendation: recommendation,
        _color: color,
        _revenue: revenue
      };
    })
    // Show only meaningful candidates
    .filter(r => r && r._revenue > 0);

  // Sort: Best scale opportunities first
  rows.sort((a, b) => b.ROI - a.ROI);

  let visibleCount = 25;

  const card = document.createElement("div");
  card.className = "report-card";

  card.innerHTML = `
    <div class="report-header">
      <div>4️⃣ Scale Opportunities</div>
      <span class="toggle-icon">▸</span>
    </div>

    <div class="report-body">
      <div id="sc-table-container"></div>
      <div id="sc-controls" style="text-align:center;margin-top:12px;"></div>
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
    link.download = "Scale_Opportunities.csv";
    link.click();
  }

  function renderTable() {
    const c = card.querySelector("#sc-table-container");
    const show = rows.slice(0, visibleCount);

    if (!rows.length) {
      c.innerHTML = `<p style="text-align:center">No scale opportunities found.</p>`;
      return;
    }

    c.innerHTML = `
      <table>
        <tr>
          ${Object.keys(show[0])
            .filter(k => !k.startsWith("_"))
            .map(h => `<th style="text-align:center">${h}</th>`)
            .join("")}
        </tr>
        ${show.map(r => `
          <tr>
            ${Object.keys(r)
              .filter(k => !k.startsWith("_"))
              .map(k => `
                <td style="text-align:center;color:${k==="Recommendation"?r._color:"inherit"}">
                  ${r[k]}
                </td>`).join("")}
          </tr>`).join("")}
      </table>
    `;

    const ctrl = card.querySelector("#sc-controls");
    ctrl.innerHTML = visibleCount >= rows.length
      ? `<button onclick="exportCSV()">Export CSV</button>`
      : `<button onclick="visibleCount+=25;renderTable()">Show More</button>
         <button onclick="exportCSV()">Export CSV</button>`;
  }

  renderTable();

  // ✅ Expand / Collapse (consistent with other reports)
  card.querySelector(".report-header").onclick = function () {
    toggleByHeader(this);
  };

  root.appendChild(card);
}
