function renderRevenueQualityReport(data, root){
  const c=document.createElement("div");
  c.className="report-card";
  c.innerHTML=`
    <div class="report-header">9️⃣ Revenue Quality</div>
    <div class="report-body">
      <table>
        <tr><th>Query</th><th>Direct %</th><th>Indirect %</th></tr>
        ${data.map(r=>{
          const t=r["Direct Revenue"]+r["Indirect Revenue"];
          return `<tr>
            <td>${r.Query}</td>
            <td>${t?((r["Direct Revenue"]/t)*100).toFixed(2):0}</td>
            <td>${t?((r["Indirect Revenue"]/t)*100).toFixed(2):0}</td>
          </tr>`;
        }).join("")}
      </table>
    </div>`;
  c.querySelector(".report-header").onclick=()=>toggle(c);
  root.appendChild(c);
}

