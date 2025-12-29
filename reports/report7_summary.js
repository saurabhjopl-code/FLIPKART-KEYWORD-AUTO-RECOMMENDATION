function renderCampaignSummary(data, root) {

  const totalClicks = data.reduce((a, b) => a + b.Clicks, 0);
  const totalCost = data.reduce((a, b) => a + b["SUM(cost)"], 0);
  const totalDirectRevenue = data.reduce((a, b) => a + b["Direct Revenue"], 0);
  const totalDirectUnits = data.reduce((a, b) => a + b[" Direct Units Sold"], 0);

  const overallCVR = totalClicks
    ? (totalDirectUnits / totalClicks) * 100
    : 0;

  const overallROI = totalCost
    ? (totalDirectRevenue / totalCost).toFixed(2)
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
          <th>Total Clicks</th>
          <th>Total Cost</th>
          <th>Direct Revenue</th>
          <th>Direct Units</th>
          <th>Direct CVR (Conversion Rate)</th>
          <th>ROI</th>
        </tr>
        <tr>
          <td>${totalClicks}</td>
          <td>₹${totalCost.toFixed(0)}</td>
          <td>₹${totalDirectRevenue.toFixed(0)}</td>
          <td>${totalDirectUnits}</td>
          <td>${overallCVR.toFixed(2)}%</td>
          <td>${overallROI}</td>
        </tr>
      </table>
    </div>
  `;

  // 🔹 FIX: Attach expand / collapse handler
  card.querySelector(".report-header").onclick = function () {
    toggleByHeader(this);
  };

  root.appendChild(card);
}
