export function renderCell(key, value, defaultValue) {
    let val = value !== undefined ? value : defaultValue;
  
    if (key === "age") {
      if (val < 18) return `${val} - Minor`;
      else if (val >= 25 && val < 50) return `${val} - major`;
      else if (val >= 50 && val < 60) return `${val} - citizen`;
      else return `${val} - senior citizen`;
    }
  
    if (key === "score") return parseFloat(val).toFixed(2);
  
    return val;
  }
  