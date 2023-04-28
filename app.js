import { formatDate, capitalize } from "./functionsModule.js";

const bookInputForm = document.querySelector(".book-input-form");
const buttonToAddBook = document.querySelectorAll(".button-form");
const bookInputFormContainer = document.querySelector(
  ".book-input-form-container"
);
const exitButton = document.querySelector(".exit-button");
const formSubmit = document.querySelector(".form-div");
const myLibrary = [];
let bookTemp = {};

let bookHardCoded = {
  author: "George R. R. Martin",
  read: true,
  lang: "English",
  pages: "694",
  published: "01.07.1996",
  title: "A Game Of Thrones",
  timestamp: "27.03.2023 17:49:38",
};
// open and close input pop-up

buttonToAddBook.forEach((btn) =>
  btn.addEventListener("click", () => {
    bookInputForm.classList.add("show-form");
    document.getElementById("title").focus();
  })
);

document.addEventListener("click", (event) => {
  if (
    !bookInputFormContainer.contains(event.target) &&
    event.target !== exitButton &&
    !event.target.classList.contains("button-form")
  ) {
    bookInputForm.classList.remove("show-form");
  }
});

exitButton.addEventListener("click", () =>
  bookInputForm.classList.remove("show-form")
);

// Object.create constructor + prototype method for creating DOM element
// and support function for render simple html text nodes
class Book {
  constructor(args) {
    this.author = args.author || "-";
    this.title = args.title || "-";
    this.pages = args.pages || "-";
    this.lang = args.lang || "-";
    this.published = args.published || "-";
    this.added = args.timestamp;
    this.read = args.read;
    this.rendered = false;
  }

  render() {
    if (!this.rendered) {
      const fragment = document.createDocumentFragment();
      const contentBody = document.querySelector(".content");
      const newBookInDOM = document.createElement("div");
      const buttonToAdd = document.querySelector(".add-item");
      const btn = document.createElement("input");
      newBookInDOM.classList.add("card");
      Object.keys(this).forEach((key) => {
        const contentDiv = document.createElement("div");
        if (key !== "read" && key !== "rendered") {
          const span = document.createElement("span");
          const objName = document.createTextNode(`${capitalize(key)}: `);
          const objValue = document.createTextNode(`${this[key]}`);
          span.appendChild(objName);
          span.classList.add("cardTitle");
          contentDiv.appendChild(span);
          contentDiv.appendChild(objValue);
        } else if (key === "read") {
          contentDiv.classList.add("button");
          contentDiv.textContent = "Read: ";
          btn.setAttribute("type", "checkbox");
          btn.classList.add("status");
          contentDiv.appendChild(btn);
          if (this[key]) {
            btn.checked = true;
            newBookInDOM.classList.add("checkedAsRead");
          } else {
            btn.checked = false;
          }
        }
        newBookInDOM.appendChild(contentDiv);
      });

      const btnRemove = document.createElement("button");
      btnRemove.classList.add("btnRemove");
      newBookInDOM.prepend(btnRemove);
      fragment.appendChild(newBookInDOM);
      contentBody.insertBefore(fragment, buttonToAdd);
      // remove
      btnRemove.addEventListener("click", () => {
        contentBody.removeChild(newBookInDOM);
        const index = myLibrary.indexOf(this);
        myLibrary.splice(index, 1);
        stats();
      });
      // read-unread status
      btn.addEventListener("click", () => {
        this.read = !this.read;
        stats();
        if (this.read) {
          newBookInDOM.classList.add("checkedAsRead");
        } else {
          newBookInDOM.classList.remove("checkedAsRead");
        }
      });
      this.rendered = true;
    }
  }
}

// input validation
formSubmit.addEventListener("input", (event) => {
  const button = document.querySelector(".submit-book-button");
  const tmp = document.querySelector(".pages-div span");
  const input = event.target;
  if (input.id === "pages") {
    const regex = /^-?\d+$/.test(input.value);
    if (!regex && input.value.trim() !== "") {
      tmp.classList.add("hint");
      button.disabled = true;
    } else {
      tmp.classList.remove("hint");
      button.disabled = false;
      bookTemp[input.name] = input.value;
    }
  } else if (input.id === "read") {
    bookTemp[input.name] = input.checked;
  } else if (input.id === "published") {
    const dateOrder = input.value.split("-");
    bookTemp[input.name] = `${dateOrder[2]}.${dateOrder[1]}.${dateOrder[0]}`;
  } else {
    bookTemp[input.name] = capitalize(input.value);
  }
});
// submit and form reset
function renderBooks() {
  myLibrary.forEach((e) => e.render());
}
formSubmit.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!bookTemp.read) {
    bookTemp.read = false;
  }
  bookTemp.timestamp = formatDate();
  bookTemp = new Book(bookTemp);
  myLibrary.push(bookTemp);
  bookTemp = {};
  formSubmit.reset();
  bookInputForm.classList.remove("show-form");
  renderBooks();
  stats();
});

window.myLibrary = myLibrary;
bookHardCoded = new Book(bookHardCoded);
myLibrary.push(bookHardCoded);

renderBooks();

function stats() {
  const total = document.querySelector(".total > span");
  total.textContent = myLibrary.length;
  const toRead = document.querySelector(".to-read > span");
  const unreadPages = myLibrary
    .filter((e) => !e.read)
    .reduce((sum, cur) => {
      const { pages } = cur;
      return sum + +pages;
    }, 0);
  toRead.textContent = unreadPages;
  const readBook = document.querySelector(".read > span");
  readBook.textContent = myLibrary.reduce((sum, cur) => {
    const { read } = cur;
    return sum + +read;
  }, 0);
}
stats();
console.log("hehehe");
