function calcDirectCVR(row) {
  return row.Clicks > 0
    ? (row[" Direct Units Sold"] / row.Clicks) * 100
    : 0;
}

function calcRPC(row) {
  return row.Clicks > 0
    ? row["Direct Revenue"] / row.Clicks
    : 0;
}

function calcIndirectShare(row) {
  const totalRevenue =
    row["Direct Revenue"] + row["Indirect Revenue"];

  return totalRevenue > 0
    ? (row["Indirect Revenue"] / totalRevenue) * 100
    : 0;
}
