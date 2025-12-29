function renderWasteReport(data, root){
  const rows = data.filter(r=>r.Clicks>=30 && r[" Direct Units Sold"]===0);
  const c=document.createElement("div");
  c.className="report-card";
  c.innerHTML=`
    <div class="report-header">2️⃣ Waste Analysis</div>
    <div class="report-body">
      <table>
        <tr><th>Query</th><th>Clicks</th><th>Cost</th></tr>
        ${rows.map(r=>`
          <tr>
            <td>${r.Query}</td>
            <td>${r.Clicks}</td>
            <td>₹${r["SUM(cost)"]}</td>
          </tr>`).join("")}
      </table>
    </div>`;
  c.querySelector(".report-header").onclick=()=>toggle(c);
  root.appendChild(c);
}

