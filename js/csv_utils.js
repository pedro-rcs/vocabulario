export function parseCSV(text) {
  const lines = text.trim().split('\n');
  const result = lines.map(line => {
    const values = [];
    let insideQuotes = false;
    let value = '';
    for (let char of line) {
      if (char === '"') insideQuotes = !insideQuotes;
      else if (char === ',' && !insideQuotes) {
        values.push(value);
        value = '';
      } else {
        value += char;
      }
    }
    values.push(value);
    return values;
  });
  return result;
}