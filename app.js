// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
// input
const grocery = document.getElementById("grocery");

const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

// const item = document.querySelector(".grocery-item");

// edit option
let editElement;
let editFlag = false;
let editID = "";

// ****** EVENT LISTENERS **********
//add item

window.addEventListener("DOMContentLoaded", setupItems);

form.addEventListener("submit", addItem);
// clear all items
clearBtn.addEventListener("click", clearList);

// ****** FUNCTIONS **********

function editItem(e) {
  editFlag = true;
  editElement = e.currentTarget.parentElement.parentElement;
  editID = editElement.dataset.id;

  submitBtn.textContent = "edit";
  grocery.value = editElement.querySelector("p").textContent;
}

function deleteItem(e) {
  const item = e.currentTarget.parentElement.parentElement;
  list.removeChild(item);
  const id = item.dataset.id;

  const items = document.querySelectorAll(".grocery-item");
  //if list is empty
  if (!items.length) {
    container.classList.remove("show-container");
  }
  displayAlert("item deleted", "danger");
  setBackToDefault();
  // remove item from localstorage using ID
  removeFromLocalStorage(id);
}

function addItem(e) {
  e.preventDefault();
  const item = grocery.value;
  const id = new Date().getTime().toString();
  // if adding new
  if (item && !editFlag) {
    // adding an item
    createListItem(id, item);
    // display alert
    displayAlert("item added", "success");
    container.classList.add("show-container");
    //add to local storage
    addToLocalStorage(id, item);
    // set back to default
    setBackToDefault();
  }
  // if editing
  else if (item && editFlag) {
    editFlag = false;
    editElement.querySelector("p").textContent = grocery.value;
    //update local storage
    editLocalStorage(editID, grocery.value);
    //set default
    displayAlert("item updated", "success");
    setBackToDefault();
  }
  // no value entered
  else {
    displayAlert("please enter a value", "danger");
  }
}

// display alert
function displayAlert(text, action) {
  alert.classList.add(`alert-${action}`);
  alert.textContent = text;

  //remove alert
  setTimeout(function () {
    alert.classList.remove(`alert-${action}`);
    alert.textContent = "";
  }, 3000);
}

function clearList() {
  localStorage.removeItem("list");
  const items = document.querySelectorAll(".grocery-item");
  if (items.length) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }

  displayAlert("all items deleted", "success");
  container.classList.remove("show-container");
  setBackToDefault();
  localStorage.removeItem("list");
}

function setBackToDefault() {
  grocery.value = "";
  editID = "";
  editFlag = false;
  submitBtn.textContent = "submit";
}

// ****** LOCAL STORAGE **********

function addToLocalStorage(id, value) {
  const item = { id, value };
  items = getLocalStorage();
  items.push(item);
  localStorage.setItem("list", JSON.stringify(items));
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map((item) => {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

// ****** SETUP ITEMS **********
function setupItems() {
  let items = getLocalStorage();
  if (items.length) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
  }
  container.classList.add("show-container");
}

function createListItem(id, value) {
  const newItem = document.createElement("article");
  // add data-id (dataset)
  const attr = document.createAttribute("data-id");
  attr.value = id;
  newItem.setAttributeNode(attr);
  newItem.classList.add("grocery-item");
  newItem.innerHTML = ` <p class="title">${value}</p>
          <div class="btn-container">
            <button type='button' class="edit-btn">
              <i class="fas fa-edit"></i>
            </button>
            <button type='button' class="delete-btn">
              <i class="fas fa-trash"></i>
            </button>
          </div>`;
  // access edit and delete buttons
  const editBtn = newItem
    .querySelector(".edit-btn")
    .addEventListener("click", editItem);
  const deleteBtn = newItem
    .querySelector(".delete-btn")
    .addEventListener("click", deleteItem);
  //append child
  list.appendChild(newItem);
}
