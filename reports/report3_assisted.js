function renderAssistedReport(data, root) {

  // ===== BUILD + FILTER ROWS =====
  let rows = data
    .map(r => {

      const views = r.Views || 0;
      const clicks = r.Clicks || 0;
      const adsSpend = r["SUM(cost)"] || 0;

      const directUnits = r[" Direct Units Sold"] || 0;
      const indirectUnits = r["Indirect Units Sold"] || 0;

      const directRevenue = r["Direct Revenue"] || 0;

      const ctr = views ? (clicks / views) * 100 : 0;
      const cvr = clicks ? ((directUnits + indirectUnits) / clicks) * 100 : 0;

      const assistPct =
        (directUnits + indirectUnits) > 0
          ? (indirectUnits / (directUnits + indirectUnits)) * 100
          : 0;

      // ===== REMARKS LOGIC =====
      let remarks = "No Assist";
      let color = "#dc2626"; // Red

      if (assistPct > 50) {
        remarks = "Heavy Assist";
        color = "#16a34a"; // Green
      } else if (assistPct > 30) {
        remarks = "Mid Assist";
        color = "#f59e0b"; // Amber
      } else if (assistPct > 0) {
        remarks = "Low Assist";
        color = "#fb923c"; // Orange
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
        _adsSpend: adsSpend,
        _directRevenue: directRevenue
      };
    })
    // 🔒 FILTER: NO DIRECT REVENUE + SPEND > 0
    .filter(r => r._directRevenue === 0 && r._adsSpend > 0);

  // ===== SORT: HIGHEST ASSIST % FIRST =====
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
      <div id="as-controls" style="text-align:center; margin-top:12px;"></div>
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
    link.download = "Assisted_Halo_Sales.csv";
    link.click();
  }

  // ===== RENDER TABLE =====
  function renderTable() {
    const container = card.querySelector("#as-table-container");
    const displayRows = rows.slice(0, visibleCount);

    if (rows.length === 0) {
      container.innerHTML = `<p style="text-align:center">No assisted keywords found.</p>`;
      card.querySelector("#as-controls").innerHTML = "";
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
                <td style="text-align:center; color:${k === "Remarks" ? r._color : "inherit"}">
                  ${r[k]}
                </td>`).join("")}
          </tr>
        `).join("")}
      </table>
    `;

    const controls = card.querySelector("#as-controls");

    if (visibleCount >= rows.length) {
      controls.innerHTML = `
        <button id="as-top">Top 25</button>
        <button id="as-collapse">Collapse All</button>
        <button id="as-export">Export CSV</button>
      `;

      controls.querySelector("#as-top").onclick = () => {
        visibleCount = 25;
        renderTable();
        container.scrollIntoView({ behavior: "smooth" });
      };

      controls.querySelector("#as-collapse").onclick = () => {
        card.querySelector(".report-body").style.display = "none";
        card.querySelector(".toggle-icon").textContent = "▸";
      };

      controls.querySelector("#as-export").onclick = exportCSV;

    } else {
      controls.innerHTML = `
        <button id="as-show-more">Show More</button>
        <button id="as-export">Export CSV</button>
      `;

      controls.querySelector("#as-show-more").onclick = () => {
        visibleCount += 25;
        renderTable();
      };

      controls.querySelector("#as-export").onclick = exportCSV;
    }
  }

  renderTable();

  card.querySelector(".report-header").onclick = function () {
    toggleByHeader(this);
  };

  root.appendChild(card);
}
