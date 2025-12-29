function renderBiddingReport(data, root){
  const c=document.createElement("div");
  c.className="report-card";
  c.innerHTML=`
    <div class="report-header">6️⃣ Bidding Health</div>
    <div class="report-body">
      <table>
        <tr><th>Query</th><th>Avg CPC</th><th>RPC</th></tr>
        ${data.map(r=>`
          <tr>
            <td>${r.Query}</td>
            <td>${r["Average CPC"]}</td>
            <td>${rpc(r).toFixed(2)}</td>
          </tr>`).join("")}
      </table>
    </div>`;
  c.querySelector(".report-header").onclick=()=>toggle(c);
  root.appendChild(c);
}

