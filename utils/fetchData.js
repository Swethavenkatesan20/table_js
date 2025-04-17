export async function fetchData(offset = 0, limit = 10) {
    const res = await fetch(`http://localhost:3330/data?limit=${limit}&offset=${offset}`);
    const json = await res.json();
    return json.data;
  }
  