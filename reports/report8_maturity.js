function renderQueryMaturityReport(data, root) {

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

  // ===== BUILD MATURITY ROWS =====
  let rows = data
    .map(r => {

      const clicks = r.Clicks || 0;
      if (clicks <= 0) return null;

      const directUnits = getValueByContains(r, "direct units sold");
      const indirectUnits = getValueByContains(r, "indirect units sold");
      const totalUnits = directUnits + indirectUnits;

      const revenue =
        getValueByContains(r, "direct revenue") +
        getValueByContains(r, "indirect revenue");

      const cvr = clicks ? (totalUnits / clicks) * 100 : 0;

      let stage = "New";
      let color = "#2563eb"; // Blue

      if (clicks >= 50 && cvr < 1) {
        stage = "Declining";
        color = "#dc2626"; // Red
      }
      else if (clicks >= 50 && cvr >= 3 && revenue >= 5000) {
        stage = "Mature";
        color = "#7c3aed"; // Purple
      }
      else if (clicks >= 30 && cvr >= 2) {
        stage = "Growing";
        color = "#16a34a"; // Green
      }

      return {
        Keyword: r.Query,
        Clicks: clicks,
        "CVR %": cvr.toFixed(2),
        "Total Units Sold": totalUnits,
        "Total Revenue": revenue.toFixed(0),
        "Maturity Stage": stage,
        _color: color
      };
    })
    .filter(Boolean);

  // Sort: Mature → Growing → New → Declining (business-friendly view)
  const order = { "Mature": 1, "Growing": 2, "New": 3, "Declining": 4 };
  rows.sort((a, b) => order[a["Maturity Stage"]] - order[b["Maturity Stage"]]);

  let visibleCount = 25;

  const card = document.createElement("div");
  card.className = "report-card";

  card.innerHTML = `
    <div class="report-header">
      <div>8️⃣ Query Maturity</div>
      <span class="toggle-icon">▸</span>
    </div>

    <div class="report-body">
      <div id="qm-table-container"></div>
      <div id="qm-controls" style="text-align:center;margin-top:12px;"></div>
    </div>
  `;

  // ===== CSV EXPORT =====
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
    link.download = "Query_Maturity.csv";
    link.click();
  }

  // ===== RENDER TABLE =====
  function renderTable() {
    const c = card.querySelector("#qm-table-container");
    const show = rows.slice(0, visibleCount);

    if (!rows.length) {
      c.innerHTML = `<p style="text-align:center">No maturity data available.</p>`;
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
                <td style="text-align:center;color:${k==="Maturity Stage"?r._color:"inherit"}">
                  ${r[k]}
                </td>`).join("")}
          </tr>`).join("")}
      </table>
    `;

    const ctrl = card.querySelector("#qm-controls");
    ctrl.innerHTML = visibleCount >= rows.length
      ? `<button onclick="exportCSV()">Export CSV</button>`
      : `<button onclick="visibleCount+=25;renderTable()">Show More</button>
         <button onclick="exportCSV()">Export CSV</button>`;
  }

  renderTable();

  // ✅ Expand / Collapse
  card.querySelector(".report-header").onclick = function () {
    toggleByHeader(this);
  };

  root.appendChild(card);
}
