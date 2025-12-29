/* =========================================================
   REPORT 6 – BIDDING HEALTH
   Safe-wired version (no loader change required)
   ========================================================= */

function _renderReport6Bidding(data, root) {

  // ---------- Header-agnostic value resolver ----------
  function getValueByContains(row, text) {
    const key = Object.keys(row).find(k =>
      k.replace(/\s+/g, " ")
        .trim()
        .toLowerCase()
        .includes(text.toLowerCase())
    );
    return key ? Number(row[key]) || 0 : 0;
  }

  // ---------- Build rows ----------
  let rows = data
    .map(r => {
      const clicks = r.Clicks || 0;
      if (clicks <= 0) return null;

      const avgCPC = r["Average CPC"] || 0;
      const adsSpend = getValueByContains(r, "cost");

      const revenue =
        getValueByContains(r, "direct revenue") +
        getValueByContains(r, "indirect revenue");

      const roi = adsSpend ? revenue / adsSpend : 0;
      const breakEvenCPC = revenue / clicks;

      let status = "Healthy";
      let color = "#16a34a";

      if (avgCPC > breakEvenCPC) {
        status = "Overbid";
        color = "#dc2626";
      }

      return {
        Keyword: r.Query,
        Clicks: clicks,
        "Average CPC": avgCPC.toFixed(2),
        "Break-even CPC": breakEvenCPC.toFixed(2),
        "Ads Spend": adsSpend.toFixed(0),
        "Total Revenue": revenue.toFixed(0),
        ROI: roi.toFixed(2),
        Status: status,
        _color: color
      };
    })
    .filter(Boolean);

  // Sort: worst bids first
  rows.sort((a, b) => (b["Average CPC"] - b["Break-even CPC"]));

  let visibleCount = 25;

  const card = document.createElement("div");
  card.className = "report-card";

  card.innerHTML = `
    <div class="report-header">
      <div>6️⃣ Bidding Health</div>
      <span class="toggle-icon">▸</span>
    </div>

    <div class="report-body">
      <div id="bh-table"></div>
      <div id="bh-controls" style="text-align:center;margin-top:12px;"></div>
    </div>
  `;

  // ---------- CSV Export ----------
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
    link.download = "Bidding_Health.csv";
    link.click();
  }

  // ---------- Render ----------
  function renderTable() {
    const c = card.querySelector("#bh-table");
    const show = rows.slice(0, visibleCount);

    if (!rows.length) {
      c.innerHTML = `<p style="text-align:center">No bidding issues detected.</p>`;
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
                <td style="text-align:center;color:${k === "Status" ? r._color : "inherit"}">
                  ${r[k]}
                </td>`).join("")}
          </tr>`).join("")}
      </table>
    `;

    card.querySelector("#bh-controls").innerHTML =
      visibleCount >= rows.length
        ? `<button onclick="exportCSV()">Export CSV</button>`
        : `<button onclick="visibleCount+=25;renderTable()">Show More</button>
           <button onclick="exportCSV()">Export CSV</button>`;
  }

  renderTable();

  // Expand / collapse (existing global handler)
  card.querySelector(".report-header").onclick = function () {
    toggleByHeader(this);
  };

  root.appendChild(card);
}

/* =========================================================
   SAFE ALIASES — DO NOT REMOVE
   These ensure the loader can call ANY of these names
   ========================================================= */

function renderBiddingHealthReport(data, root) {
  _renderReport6Bidding(data, root);
}

function renderBiddingReport(data, root) {
  _renderReport6Bidding(data, root);
}

function renderReport6(data, root) {
  _renderReport6Bidding(data, root);
}
