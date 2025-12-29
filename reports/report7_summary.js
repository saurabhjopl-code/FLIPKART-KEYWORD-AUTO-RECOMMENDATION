function renderCampaignSummary(data, root) {

  // ===== HEADER-AGNOSTIC VALUE RESOLVER (LOCKED APPROACH) =====
  function getValueByContains(row, text) {
    const key = Object.keys(row).find(k =>
      k.replace(/\s+/g, " ")
        .trim()
        .toLowerCase()
        .includes(text.toLowerCase())
    );
    return key ? Number(row[key]) || 0 : 0;
  }

  // ===== AGGREGATION (UNIT LOGIC FIXED) =====
  const summary = data.reduce((acc, r) => {

    const views = r.Views || 0;
    const clicks = r.Clicks || 0;

    const directUnits = getValueByContains(r, "direct units sold");
    const indirectUnits = getValueByContains(r, "indirect units sold");
    const totalUnits = directUnits + indirectUnits; // ✅ FIX

    const adsSpend = getValueByContains(r, "cost");

    const revenue =
      getValueByContains(r, "direct revenue") +
      getValueByContains(r, "indirect revenue");

    acc.views += views;
    acc.clicks += clicks;
    acc.units += totalUnits;
    acc.spend += adsSpend;
    acc.revenue += revenue;

    return acc;
  }, {
    views: 0,
    clicks: 0,
    units: 0,
    spend: 0,
    revenue: 0
  });

  // ===== KPI CALCULATIONS (UNCHANGED LOGIC) =====
  const ctr = summary.views
    ? (summary.clicks / summary.views) * 100
    : 0;

  const cvr = summary.clicks
    ? (summary.units / summary.clicks) * 100
    : 0;

  const avgCPC = summary.clicks
    ? summary.spend / summary.clicks
    : 0;

  const roi = summary.spend
    ? summary.revenue / summary.spend
    : 0;

  // ===== RENDER SUMMARY (UI UNCHANGED) =====
  const card = document.createElement("div");
  card.className = "report-card";

  card.innerHTML = `
    <div class="report-header">
      <div>📊 Campaign Summary</div>
      <span class="toggle-icon">▸</span>
    </div>

    <div class="report-body">
      <table>
        <tr>
          <th style="text-align:center">Views</th>
          <th style="text-align:center">Clicks</th>
          <th style="text-align:center">CTR %</th>
          <th style="text-align:center">CVR %</th>
          <th style="text-align:center">Average CPC</th>
          <th style="text-align:center">Ads Spend</th>
          <th style="text-align:center">Total Units Sold</th>
          <th style="text-align:center">Total Revenue</th>
          <th style="text-align:center">ROI</th>
        </tr>
        <tr>
          <td style="text-align:center">${summary.views}</td>
          <td style="text-align:center">${summary.clicks}</td>
          <td style="text-align:center">${ctr.toFixed(2)}%</td>
          <td style="text-align:center">${cvr.toFixed(2)}%</td>
          <td style="text-align:center">₹${avgCPC.toFixed(2)}</td>
          <td style="text-align:center">₹${summary.spend.toFixed(0)}</td>
          <td style="text-align:center">${summary.units}</td>
          <td style="text-align:center">₹${summary.revenue.toFixed(0)}</td>
          <td style="text-align:center">${roi.toFixed(2)}</td>
        </tr>
      </table>
    </div>
  `;

  // ✅ EXPAND / COLLAPSE (CONSISTENT WITH OTHER REPORTS)
  card.querySelector(".report-header").onclick = function () {
    toggleByHeader(this);
  };

  root.appendChild(card);
}
