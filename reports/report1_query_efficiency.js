function renderQueryEfficiency(data, root) {
  const c = document.createElement("div");
  c.className = "report-card";
  c.innerHTML = `
    <div class="report-header">
      <div>1️⃣ Query Performance Efficiency</div>
      <span class="toggle-icon">▸</span>
    </div>
    <div class="report-body">
      <table>
        <tr>
          <th>Query</th><th>Clicks</th><th>Direct Units</th>
          <th>Cost</th><th>Direct Revenue</th>
          <th>Direct CVR (Conversion Rate)</th>
          <th>CPO (Cost per Order)</th>
        </tr>
        ${data.map(r => {
          const cpo = r[" Direct Units Sold"]
            ? r["SUM(cost)"] / r[" Direct Units Sold"]
            : 0;
          return `
          <tr>
            <td>${r.Query}</td>
            <td>${r.Clicks}</td>
            <td>${r[" Direct Units Sold"]}</td>
            <td>₹${r["SUM(cost)"]}</td>
            <td>₹${r["Direct Revenue"]}</td>
            <td>${directCVR(r).toFixed(2)}%</td>
            <td>₹${cpo.toFixed(0)}</td>
          </tr>`;
        }).join("")}
      </table>
    </div>`;
  c.querySelector(".report-header").onclick = function () { toggleByHeader(this); };
  root.appendChild(c);
}
