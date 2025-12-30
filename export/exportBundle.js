/* =====================================
   EXPORT ALL REPORTS – v12.30
   Non-invasive, report-safe
   ===================================== */

window.__EXPORT_DATA__ = window.__EXPORT_DATA__ || {};

function registerReportData(reportName, rows) {
  if (!rows || !rows.length) return;
  window.__EXPORT_DATA__[reportName] = rows;
}

function exportAllReportsAsZip() {
  if (!window.JSZip) {
    alert("JSZip not loaded");
    return;
  }

  const zip = new JSZip();
  const dataMap = window.__EXPORT_DATA__;

  Object.keys(dataMap).forEach(name => {
    const rows = dataMap[name];
    if (!rows || !rows.length) return;

    const headers = Object.keys(rows[0]).filter(k => !k.startsWith("_"));
    const csv = [
      headers.join(","),
      ...rows.map(r => headers.map(h => `"${r[h]}"`).join(","))
    ].join("\n");

    zip.file(`${name}.csv`, csv);
  });

  zip.generateAsync({ type: "blob" }).then(blob => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Flipkart_Keyword_Analysis_v12.30.zip";
    link.click();
  });
}
