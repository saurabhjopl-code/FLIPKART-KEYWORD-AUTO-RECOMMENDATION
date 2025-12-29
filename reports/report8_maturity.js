function renderMaturityReport(data, root) {
  const bucket = r => {
    if (r.Clicks < 50) return "Test";
    if (r.Clicks >= 30 && r[" Direct Units Sold"] === 0) return "Waste";
    if (directCVR(r) >= 4 && r.ROI >= 4) return "⭐ Hero";
    if (directCVR(r) >= 2) return "Growth";
    return "Other";
  };

  const c = document.createElement("div");
  c.className = "report-card";
  c.innerHTML = `
    <div class="report-header">
      <div>8️⃣ Query Maturity</div>
      <span class="toggle-icon">▸</span>
    </div>
    <div class="report-body">
      <table>
        <tr><th>Query</th><th>Clicks</th><th>CVR</th><th>ROI</th><th>Bucket</th></tr>
        ${data.map(r => `
          <tr>
            <td>${r.Query}</td>
            <td>${r.Clicks}</td>
            <td>${directCVR(r).toFixed(2)}%</td>
            <td>${r.ROI}</td>
            <td>${bucket(r)}</td>
          </tr>`).join("")}
      </table>
    </div>`;
  c.querySelector(".report-header").onclick = function () { toggleByHeader(this); };
  root.appendChild(c);
}
