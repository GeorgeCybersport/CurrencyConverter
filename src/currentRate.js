import getRates from "./getRates";
export default {
  valutesList: [],
  favouriteValutesList: [],
  date: "",
  init: async function () {
    const result = await getRates();
    this.getValutesList(result);
    this.renderFields();
    this.buttonListner();
  },
  getValutesList(result) {
    let valutes = [];
    for (let valute in result.Valute) {
      valutes.push(result.Valute[valute]);
    }
    this.valutesList = valutes;
    this.date = result.Date;
    this.date = this.date.slice(0, 10);
  },
  createPage() {
    const tags =
      '<h1 id="date" class="date"></h1>' +
      '<div id="formData" class="formData">' +
      "</div>" +
      '<div id="lists" class="lists">' +
      "</div>";
    document.querySelector("form").innerHTML = tags;
    const uls =
      "<div>" +
      "<h3>" +
      "Курс избранных валют:" +
      "</h3>" +
      "<ul></ul>" +
      "</div>" +
      "<div>" +
      "<h3>" +
      "Курс валют:" +
      "</h3>" +
      "<ul></ul>" +
      "</div>";
    document.getElementById("lists").innerHTML = uls;
    document.getElementById("formData").innerHTML =
      "<select></select>" + "      <button>В избранное</button>";
    document.getElementById("date").innerText = "Данные на " + this.date;
  },
  buttonListner() {
    document.getElementsByTagName("button")[0].addEventListener("click", () => {
      const favorite = this.valutesList.find((valute) => {
        if (valute.ID === document.getElementsByTagName("select")[0].value) {
          return true;
        }
      });
      let items = JSON.parse(localStorage.getItem("favourite"));
      if (!items) {
        localStorage.setItem("favourite", JSON.stringify(favorite));
      } else {
        if (Array.isArray(items)) {
          if (!this.findData(items, favorite)) {
            items.unshift(favorite);
            localStorage.setItem("favourite", JSON.stringify(items));
          }
        } else {
          if (items.ID !== favorite.ID)
            localStorage.setItem(
              "favourite",
              JSON.stringify([items, favorite])
            );
        }
      }
      this.filterData();
    });
  },
  filterData() {
    const items = JSON.parse(localStorage.getItem("favourite"));
    if (items) {
      if (Array.isArray(items)) {
        this.valutesList = this.valutesList.filter((valute) => {
          return !this.findData(items, valute);
        });
        this.favouriteValutesList = items;
      } else {
        this.valutesList = this.valutesList.filter((valute) => {
          return !(items.ID === valute.ID);
        });
        this.favouriteValutesList = items;
      }
    }
    this.renderList();
  },
  findData(items, favorite) {
    const result = items.find((item) => {
      return item.ID === favorite.ID;
    });
    return result;
  },
  getTags() {
    const keys = Object.keys(this.valutesList);
    let tags = [];
    keys.map((key) => {
      tags.push(
        `<option value=${this.valutesList[key].ID}>${this.valutesList[key].Name}</option>`
      );
    });
    return tags;
  },
  renderList() {
    const uls = document.getElementsByTagName("ul");
    const [favUl, ul] = document.getElementsByTagName("ul");
    let list = this.getListTags(this.valutesList);
    const favList = this.getListTags(this.favouriteValutesList);
    ul.innerHTML = list;
    favUl.innerHTML = favList;
  },
  getListTags(arr) {
    const list = [];
    arr.forEach((elem) => {
      const tag = `<li>${Math.round(elem.Value * 100) / 100} рублей за ${
        elem.Nominal
      } ${elem.CharCode}</li>`;
      list.push(tag);
    });
    return list;
  },
  renderFields: async function () {
    this.createPage();
    const [select] = document.getElementsByTagName("select");
    select.innerHTML = await this.getTags();
    this.filterData();
  },
  destroyPage() {
    document.querySelector("form").innerHTML = "";
  },
};
