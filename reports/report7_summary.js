function renderCampaignSummary(data, root) {
  const totalClicks = data.reduce((a, b) => a + b.Clicks, 0);
  const totalCost = data.reduce((a, b) => a + b["SUM(cost)"], 0);
  const totalRevenue = data.reduce((a, b) => a + b["Direct Revenue"], 0);

  const c = document.createElement("div");
  c.className = "report-card";
  c.innerHTML = `
    <div class="report-header">
      <div>📌 Campaign Summary</div>
      <span class="toggle-icon">▾</span>
    </div>
    <div class="report-body" style="display:block">
      <table>
        <tr><th>Total Clicks</th><th>Total Cost</th><th>Direct Revenue</th><th>ROI</th></tr>
        <tr>
          <td>${totalClicks}</td>
          <td>₹${totalCost}</td>
          <td>₹${totalRevenue}</td>
          <td>${(totalRevenue / totalCost).toFixed(2)}</td>
        </tr>
      </table>
    </div>`;
  root.appendChild(c);
}
