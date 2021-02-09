import currencyConverter from "./currencyConverter";
import currentRate from "./currentRate";
function getRouteInfo() {
  const hash = location.hash ? location.hash.slice(1) : "";
  return hash;
}
function changeLink() {
  const [firstLink, secondLink]=document.querySelectorAll("header>a");
  const hash = getRouteInfo();
  if (hash === "checkValuteCost") {
    currencyConverter.destroyConverter();
    firstLink.classList.add("active");
    secondLink.classList.contains("active") && secondLink.classList.remove("active");
    currentRate.init();
  } else if (hash === "countValute") {
    currentRate.destroyPage();
    secondLink.classList.add("active");
    firstLink.classList.contains("active") && firstLink.classList.remove("active");
    currencyConverter.init();
  }
}
export default {
  init() {
    addEventListener("hashchange", changeLink);
    changeLink();
  },
};
