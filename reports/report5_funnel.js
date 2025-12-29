function renderFunnelReport(data, root) {
  const c = document.createElement("div");
  c.className = "report-card";
  c.innerHTML = `
    <div class="report-header">
      <div>5️⃣ Funnel Efficiency</div>
      <span class="toggle-icon">▸</span>
    </div>
    <div class="report-body">
      <table>
        <tr><th>Query</th><th>CTR %</th><th>CVR %</th></tr>
        ${data.map(r => `
          <tr>
            <td>${r.Query}</td>
            <td>${r["Click Through Rate in %"]}</td>
            <td>${directCVR(r).toFixed(2)}</td>
          </tr>`).join("")}
      </table>
    </div>`;
  c.querySelector(".report-header").onclick = function () {
    toggleByHeader(this);
  };
  root.appendChild(c);
}
