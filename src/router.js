import currencyConverter from "./currencyConverter";
import currentRate from "./currentRate";
function getRouteInfo() {
  const hash = location.hash ? location.hash.slice(1) : "";
  return hash;
}
function changeLink() {
  const hash = getRouteInfo();
  if (hash === "checkValuteCost") {
    currencyConverter.destroyConverter();
    currentRate.init();
  } else if (hash === "countValute") {
    currentRate.destroyPage();
    currencyConverter.init();
  }
}
export default {
  init() {
    addEventListener("hashchange", changeLink);
    changeLink();
  },
};
