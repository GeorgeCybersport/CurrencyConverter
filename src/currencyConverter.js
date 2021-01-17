import getRates from "./getRates";
export default {
  valutesList: [],
  messageBlock: document.getElementsByClassName("message"),
  selects: document.getElementsByTagName("select"),
  firstValute: {},
  secondValute: {},
  sum: 0,
  init: async function () {
    const result = await getRates();
    this.getValutesList(result);
    this.renderFields();
    this.events();
  },
  getValutesList(result) {
    let valutes = [];
    for (let valute in result.Valute) {
      valutes.push(result.Valute[valute]);
    }
    this.valutesList = valutes;
  },
  createForm() {
    const newTags =
      "<h3>Выберите валюту, которую вы хотите перевести</h3>\n" +
      "      <select></select>\n" +
      "      <h3>Выберите валюту, в которую вы хотите перевести</h3>\n" +
      "      <select></select>" +
      "      <div class='message'> </div>";
    document.querySelector("form").insertAdjacentHTML("afterbegin", newTags);
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
  renderFields() {
    this.createForm();
    const [firstSelect, secondSelect] = this.selects;
    firstSelect.insertAdjacentHTML(
      "afterend",
      "<h3>Введите сумму перевода</h3><input type='text'>"
    );
    const tags = this.getTags();
    firstSelect.innerHTML = tags;
    secondSelect.innerHTML = tags;
    this.findItems(firstSelect, secondSelect, this.valutesList);
    this.countCourse();
  },
  events() {
    const [firstSelect, secondSelect] = this.selects;
    const input = document.querySelector("input");
    firstSelect.addEventListener("change", () => {
      this.findItems(firstSelect, secondSelect, this.valutesList);
      this.countCourse();
    });
    secondSelect.addEventListener("change", () => {
      this.findItems(firstSelect, secondSelect, this.valutesList);
      this.countCourse();
    });
    input.addEventListener("input", (event) => {
      if (!isNaN(event.target.value)) {
        this.sum = event.target.value;
        this.countCourse();
      } else event.target.value = "";
    });
  },
  findItems(firstSelect, secondSelect, valutes) {
    this.firstValute = valutes.find((valute) => {
      if (valute.ID === firstSelect.value) return true;
    });
    this.secondValute = valutes.find((valute) => {
      if (valute.ID === secondSelect.value) return true;
    });
  },
  countCourse() {
    const result =
      Math.round(
        ((this.firstValute.Value * this.sum) /
          this.firstValute.Nominal /
          this.secondValute.Value) *
          100
      ) / 100;
    const message = `Вы получите ${result} ${this.secondValute.CharCode} за ${this.sum} ${this.firstValute.CharCode}`;
    this.messageBlock[0].innerText = message;
  },
  destroyConverter() {
    document.querySelector("form").innerHTML = "";
  },
};
