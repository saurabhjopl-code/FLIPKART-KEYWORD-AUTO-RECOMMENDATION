function renderAssistedReport(data, root) {
  const c = document.createElement("div");
  c.className = "report-card";
  c.innerHTML = `
    <div class="report-header">
      <div>3️⃣ Assisted / Halo Sales</div>
      <span class="toggle-icon">▸</span>
    </div>
    <div class="report-body">
      <table>
        <tr><th>Query</th><th>Indirect Share %</th></tr>
        ${data.map(r => `
          <tr>
            <td>${r.Query}</td>
            <td>${indirectShare(r).toFixed(2)}</td>
          </tr>`).join("")}
      </table>
    </div>`;
  c.querySelector(".report-header").onclick = function () {
    toggleByHeader(this);
  };
  root.appendChild(c);
}
