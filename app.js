document.getElementById("csvFile").addEventListener("change", handleFile);

function handleFile(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    processCSV(e.target.result);
  };

  reader.readAsText(file);
}

function processCSV(text) {
  const lines = text.split("\n").filter(l => l.trim() !== "");

  // FIRST TWO ROWS → REPORT PERIOD
  const startDate = lines[0];
  const endDate = lines[1];

  document.getElementById("reportPeriod").innerText =
    `Report Period: ${startDate} → ${endDate}`;

  // HEADER ROW (ROW 3)
  const headers = lines[2].split(",");

  // DATA ROWS START FROM ROW 4
  const dataRows = lines.slice(3).map(line => {
    const values = line.split(",");
    const obj = {};

    headers.forEach((h, i) => {
      const key = h.trim();
      const val = values[i];

      obj[key] = isNaN(val) ? val : Number(val);
    });

    return obj;
  });

  renderTable(dataRows);
}

function renderTable(rows) {
  const tbody = document.querySelector("#resultTable tbody");
  tbody.innerHTML = "";

  rows.forEach(row => {
    const rec = applyRules(row);
    const directCVR = calcDirectCVR(row).toFixed(2);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.Query}</td>
      <td>${row.Clicks}</td>
      <td>${directCVR}%</td>
      <td>${row.ROI}</td>
      <td>${rec.rule}</td>
      <td>${rec.action}</td>
    `;

    tbody.appendChild(tr);
  });
}
