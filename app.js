document.getElementById("csvFile").onchange = e => {
  const reader = new FileReader();
  reader.onload = () => loadCSV(reader.result);
  reader.readAsText(e.target.files[0]);
};

function loadCSV(text){
  const lines = text.split("\n").filter(x=>x.trim());
  document.getElementById("reportPeriod").innerText =
    `Report Period: ${lines[0]} → ${lines[1]}`;

  const headers = lines[2].split(",");
  const rows = lines.slice(3).map(l=>{
    const v=l.split(","), o={};
    headers.forEach((h,i)=>o[h.trim()]=isNaN(v[i])?v[i]:+v[i]);
    return o;
  });

  const reportsDiv = document.getElementById("reports");
  reportsDiv.innerHTML = "";

  [
    renderQueryEfficiency,
    renderWasteReport,
    renderAssistedReport,
    renderScaleReport,
    renderFunnelReport,
    renderBiddingReport,
    renderCampaignReport,
    renderMaturityReport,
    renderRevenueQualityReport,
    renderScorecard
  ].forEach(fn => fn(rows, reportsDiv));
}
