function renderQueryEfficiency(data, root){
  const c = document.createElement("div");
  c.className="report-card";
  c.innerHTML=`
    <div class="report-header">1️⃣ Query Performance Efficiency</div>
    <div class="report-body">
      <table>
        <tr><th>Query</th><th>Clicks</th><th>CVR %</th><th>RPC</th></tr>
        ${data.map(r=>`
          <tr>
            <td>${r.Query}</td>
            <td>${r.Clicks}</td>
            <td>${directCVR(r).toFixed(2)}</td>
            <td>₹${rpc(r).toFixed(2)}</td>
          </tr>`).join("")}
      </table>
    </div>`;
  c.querySelector(".report-header").onclick=()=>toggle(c);
  root.appendChild(c);
}
