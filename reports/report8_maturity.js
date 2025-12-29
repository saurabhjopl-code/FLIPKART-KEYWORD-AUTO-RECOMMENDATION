function renderMaturityReport(data, root) {
  const bucket = r => {
    if (r.Clicks < 20) return "Test";
    if (r[" Direct Units Sold"] === 0) return "Waste";
    if (directCVR(r) >= 4) return "Hero";
    return "Growth";
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
        <tr><th>Query</th><th>Bucket</th></tr>
        ${data.map(r => `
          <tr>
            <td>${r.Query}</td>
            <td>${bucket(r)}</td>
          </tr>`).join("")}
      </table>
    </div>`;
  c.querySelector(".report-header").onclick = function () {
    toggleByHeader(this);
  };
  root.appendChild(c);
}
