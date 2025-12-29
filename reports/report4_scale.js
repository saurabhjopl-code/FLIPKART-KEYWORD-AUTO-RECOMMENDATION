function renderScaleReport(data, root) {
  const rows = data.filter(r => directCVR(r) >= 4 && r.ROI >= 4);

  const c = document.createElement("div");
  c.className = "report-card";
  c.innerHTML = `
    <div class="report-header">
      <div>4️⃣ Scale Opportunities</div>
      <span class="toggle-icon">▸</span>
    </div>
    <div class="report-body">
      ${rows.length === 0 ? "No scale-ready queries found." : `
      <table>
        <tr><th>Query</th><th>Clicks</th><th>CVR</th><th>ROI</th></tr>
        ${rows.map(r => `
          <tr>
            <td>${r.Query}</td>
            <td>${r.Clicks}</td>
            <td>${directCVR(r).toFixed(2)}%</td>
            <td>${r.ROI}</td>
          </tr>`).join("")}
      </table>`}
    </div>`;
  c.querySelector(".report-header").onclick = function () { toggleByHeader(this); };
  root.appendChild(c);
}
