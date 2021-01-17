export default async function getRates() {
  const result = await fetch("https://www.cbr-xml-daily.ru/daily_json.js")
    .then((res) => res.json())
    .then((result) => {
      return result;
    });
  return result;
}
