function renderCampaignReport(data, root){
  const map={};
  data.forEach(r=>{
    map[r["Campaign Name"]] ??= {rev:0,cost:0};
    map[r["Campaign Name"]].rev+=r["Direct Revenue"];
    map[r["Campaign Name"]].cost+=r["SUM(cost)"];
  });

  const c=document.createElement("div");
  c.className="report-card";
  c.innerHTML=`
    <div class="report-header">7️⃣ Campaign Contribution</div>
    <div class="report-body">
      <table>
        <tr><th>Campaign</th><th>Revenue</th><th>Cost</th></tr>
        ${Object.entries(map).map(([k,v])=>`
          <tr><td>${k}</td><td>₹${v.rev}</td><td>₹${v.cost}</td></tr>`).join("")}
      </table>
    </div>`;
  c.querySelector(".report-header").onclick=()=>toggle(c);
  root.appendChild(c);
}

