document.getElementById("csvFile").onchange = e => {
  const r = new FileReader();
  r.onload = () => loadCSV(r.result);
  r.readAsText(e.target.files[0]);
};

function loadCSV(text){
  const lines = text.split("\n").filter(x => x.trim());

  // REPORT PERIOD
  document.getElementById("reportPeriod").innerText =
    `Report Period: ${lines[0]} → ${lines[1]}`;

  const headers = lines[2].split(",");
  const rows = lines.slice(3).map(l => {
    const v = l.split(",");
    const o = {};
    headers.forEach((h,i)=>o[h.trim()] = isNaN(v[i]) ? v[i] : +v[i]);
    return o;
  });

  // 🔹 CAMPAIGN NAME (ID) LOGIC
  const campaignSet = new Map();
  rows.forEach(r => {
    campaignSet.set(
      `${r["Campaign Name"]} (${r["Campaign ID"]})`,
      true
    );
  });

  document.getElementById("campaignInfo").innerText =
    campaignSet.size === 1
      ? `Campaign: ${[...campaignSet.keys()][0]}`
      : "Campaign: Multiple Campaigns";

  // RENDER REPORTS
  const root = document.getElementById("reports");
  root.innerHTML = "";

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
  ].forEach(fn => fn(rows, root));
}
