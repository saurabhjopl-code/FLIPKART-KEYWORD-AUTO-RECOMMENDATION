function directCVR(r){ return r.Clicks ? (r[" Direct Units Sold"]/r.Clicks)*100 : 0; }
function rpc(r){ return r.Clicks ? r["Direct Revenue"]/r.Clicks : 0; }
function indirectShare(r){
  const t = r["Direct Revenue"] + r["Indirect Revenue"];
  return t ? (r["Indirect Revenue"]/t)*100 : 0;
}
