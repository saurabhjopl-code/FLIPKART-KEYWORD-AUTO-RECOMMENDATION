function renderBiddingReport(data, root) {
  const TARGET_MARGIN = 0.3;

  const c = document.createElement("div");
  c.className = "report-card";
  c.innerHTML = `
    <div class="report-header">
      <div>6️⃣ Bidding Health</div>
      <span class="toggle-icon">▸</span>
    </div>
    <div class="report-body">
      <table>
        <tr>
          <th>Query</th>
          <th>Avg CPC</th>
          <th>Break-even CPC</th>
          <th>Status</th>
        </tr>
        ${data.map(r => {
          const bec = r.Clicks
            ? (r["Direct Revenue"] * TARGET_MARGIN) / r.Clicks
            : 0;
          const over = r["Average CPC"] > bec;
          return `
          <tr>
            <td>${r.Query}</td>
            <td>₹${r["Average CPC"]}</td>
            <td>₹${bec.toFixed(2)}</td>
            <td>${over ? "❌ Overbid" : "✅ Safe"}</td>
          </tr>`;
        }).join("")}
      </table>
    </div>`;
  c.querySelector(".report-header").onclick = function () { toggleByHeader(this); };
  root.appendChild(c);
}
