function renderCampaignReport(data, root) {
  const map = {};
  data.forEach(r => {
    const k = r["Campaign Name"];
    map[k] ??= { rev: 0, cost: 0 };
    map[k].rev += r["Direct Revenue"];
    map[k].cost += r["SUM(cost)"];
  });

  const c = document.createElement("div");
  c.className = "report-card";
  c.innerHTML = `
    <div class="report-header">
      <div>7️⃣ Campaign Contribution</div>
      <span class="toggle-icon">▸</span>
    </div>
    <div class="report-body">
      <table>
        <tr><th>Campaign</th><th>Revenue</th><th>Cost</th></tr>
        ${Object.entries(map).map(([k, v]) => `
          <tr>
            <td>${k}</td>
            <td>₹${v.rev}</td>
            <td>₹${v.cost}</td>
          </tr>`).join("")}
      </table>
    </div>`;
  c.querySelector(".report-header").onclick = function () {
    toggleByHeader(this);
  };
  root.appendChild(c);
}
