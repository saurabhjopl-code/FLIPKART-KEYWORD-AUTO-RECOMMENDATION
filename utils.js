function directCVR(r) {
  return r.Clicks ? (r[" Direct Units Sold"] / r.Clicks) * 100 : 0;
}

function rpc(r) {
  return r.Clicks ? r["Direct Revenue"] / r.Clicks : 0;
}

function indirectShare(r) {
  const total = r["Direct Revenue"] + r["Indirect Revenue"];
  return total ? (r["Indirect Revenue"] / total) * 100 : 0;
}

function toggleByHeader(header) {
  const card = header.closest(".report-card");
  const body = card.querySelector(".report-body");
  const icon = header.querySelector(".toggle-icon");

  const open = body.style.display === "block";
  body.style.display = open ? "none" : "block";
  icon.textContent = open ? "▸" : "▾";
}
