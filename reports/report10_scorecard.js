function renderScorecard(data, root) {
  const score = r =>
    (r.ROI * 0.4 + directCVR(r) * 0.3 + rpc(r) * 0.3).toFixed(2);

  const c = document.createElement("div");
  c.className = "report-card";
  c.innerHTML = `
    <div class="report-header">
      <div>🔟 Executive Scorecard</div>
      <span class="toggle-icon">▸</span>
    </div>
    <div class="report-body">
      <table>
        <tr><th>Query</th><th>Score</th></tr>
        ${data.map(r => `
          <tr>
            <td>${r.Query}</td>
            <td>${score(r)}</td>
          </tr>`).join("")}
      </table>
    </div>`;
  c.querySelector(".report-header").onclick = function () {
    toggleByHeader(this);
  };
  root.appendChild(c);
}
