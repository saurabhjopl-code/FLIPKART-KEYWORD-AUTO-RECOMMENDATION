function renderCampaignSummary(data, root) {

  const sum = (arr, fn) => arr.reduce((a, b) => a + fn(b), 0);

  const totalViews = sum(data, r => r.Views || 0);
  const totalClicks = sum(data, r => r.Clicks || 0);
  const adsSpend = sum(data, r => r["SUM(cost)"] || 0);

  const totalDirectUnits = sum(data, r => r[" Direct Units Sold"] || 0);
  const totalIndirectUnits = sum(data, r => r["Indirect Units Sold"] || 0);
  const totalUnitsSold = totalDirectUnits + totalIndirectUnits;

  const totalDirectRevenue = sum(data, r => r["Direct Revenue"] || 0);
  const totalIndirectRevenue = sum(data, r => r["Indirect Revenue"] || 0);
  const totalRevenue = totalDirectRevenue + totalIndirectRevenue;

  // Average CPC (ignore zero values)
  const cpcValues = data
    .map(r => r["Average CPC"])
    .filter(v => v && v > 0);

  const avgCPC = cpcValues.length
    ? cpcValues.reduce((a, b) => a + b, 0) / cpcValues.length
    : 0;

  const ctr = totalViews
    ? (totalClicks / totalViews) * 100
    : 0;

  const cvr = totalClicks
    ? (totalUnitsSold / totalClicks) * 100
    : 0;

  const roi = adsSpend
    ? (totalRevenue / adsSpend)
    : 0;

  const card = document.createElement("div");
  card.className = "report-card";

  card.innerHTML = `
    <div class="report-header">
      <div>📌 Campaign Summary</div>
      <span class="toggle-icon">▸</span>
    </div>

    <div class="report-body">
      <table>
        <tr>
          <th style="text-align:center">Views</th>
          <th style="text-align:center">Clicks</th>
          <th style="text-align:center">CTR (Click Through Rate)</th>
          <th style="text-align:center">CVR (Conversion Rate)</th>
          <th style="text-align:center">Average CPC</th>
          <th style="text-align:center">Ads Spend</th>
          <th style="text-align:center">Total Units Sold</th>
          <th style="text-align:center">Total Revenue</th>
          <th style="text-align:center">ROI</th>
        </tr>
        <tr>
          <td style="text-align:center">${totalViews}</td>
          <td style="text-align:center">${totalClicks}</td>
          <td style="text-align:center">${ctr.toFixed(2)}%</td>
          <td style="text-align:center">${cvr.toFixed(2)}%</td>
          <td style="text-align:center">₹${avgCPC.toFixed(2)}</td>
          <td style="text-align:center">₹${adsSpend.toFixed(0)}</td>
          <td style="text-align:center">${totalUnitsSold}</td>
          <td style="text-align:center">₹${totalRevenue.toFixed(0)}</td>
          <td style="text-align:center">${roi.toFixed(2)}</td>
        </tr>
      </table>
    </div>
  `;

  card.querySelector(".report-header").onclick = function () {
    toggleByHeader(this);
  };

  root.appendChild(card);
}
