function renderQueryEfficiency(data, root){
  const card = document.createElement("div");
  card.className = "report-card";

  card.innerHTML = `
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
    </div>
  `;

  card.querySelector(".report-header").onclick =
    () => toggle(card);

  root.appendChild(card);
}

function toggle(card){
  const b = card.querySelector(".report-body");
  b.style.display = b.style.display === "block" ? "none" : "block";
}

