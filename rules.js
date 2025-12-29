function applyRules(row) {
  const directCVR = calcDirectCVR(row);
  const rpc = calcRPC(row);
  const indirectShare = calcIndirectShare(row);

  // C1 — Zero Conversion Waste
  if (row.Clicks >= 30 && row[" Direct Units Sold"] === 0) {
    return {
      rule: "C1 – Zero Conversion Waste",
      action: "Pause keyword / Add as negative"
    };
  }

  // S1 — Strong Profit Scaler
  if (row.Clicks >= 100 && directCVR >= 4 && row.ROI >= 4) {
    return {
      rule: "S1 – Strong Profit Scaler",
      action: "Increase bid 10–15% & budget"
    };
  }

  // C3 — Overbidding
  if (row["Average CPC"] > rpc) {
    return {
      rule: "C3 – Overbidding",
      action: "Reduce bid by 15%"
    };
  }

  // S3 — Assisted Sales Driver
  if (indirectShare >= 60 && row.ROI >= 2) {
    return {
      rule: "S3 – Assisted Sales Driver",
      action: "Maintain bids (do not pause)"
    };
  }

  // H1 — Insufficient Data
  if (row.Clicks < 20) {
    return {
      rule: "H1 – Insufficient Data",
      action: "No action – continue testing"
    };
  }

  return {
    rule: "—",
    action: "No recommendation"
  };
}
