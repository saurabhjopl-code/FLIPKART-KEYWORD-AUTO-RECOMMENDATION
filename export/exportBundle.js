function exportAllReports(reportDataMap) {
  const zip = new JSZip();

  Object.entries(reportDataMap).forEach(([name, rows]) => {
    if (!rows || !rows.length) return;

    const headers = Object.keys(rows[0]);
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
