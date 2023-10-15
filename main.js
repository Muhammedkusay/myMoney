// balance element pop up menu
let cover = document.querySelector(".cover");
let addMoneyBtn = document.querySelector(".add-money");
let removeMoneyBtn = document.querySelector(".remove-money");
let A_doneBtn = document.querySelector(".balance-add-form .done");
let A_cancelBtn = document.querySelector(".balance-add-form .cancel");
let R_doneBtn = document.querySelector(".balance-remove-form .done");
let R_cancelBtn = document.querySelector(".balance-remove-form .cancel");
let addForm = document.querySelector(".balance-add-form");
let removeForm = document.querySelector(".balance-remove-form");

let boxesDiv = document.querySelector(".activity .boxes");

let boxesArr = [];

if (localStorage.getItem("boxes")) {
  boxesArr = JSON.parse(localStorage.getItem("boxes"));
  updateActivity();
} else {
  localStorage.setItem("boxes", boxesArr);
}

addMoneyBtn.addEventListener("click", () => {
  cover.style.display = "block";
  addForm.style.display = "block";
  addMoneyByForm();
});

removeMoneyBtn.addEventListener("click", () => {
  cover.style.display = "block";
  removeForm.style.display = "block";
  removeMoneyByForm();
});

// edit circle
let circle = document.querySelector(".progress circle");
editCircle();

// check the balance item on local storage
let balanceEl = document.querySelector(".balance h2");

if (localStorage.getItem("balance")) {
  updateBalance();
} else {
  localStorage.setItem("balance", 0);
  updateBalance();
}

// check the paid today item on local storage
let paidToday = document.querySelector(".progress .inner .number span.up");
let paidTodayLimit = document.querySelector(
  ".progress .inner .number span.down"
);
let changePaidToday = document.querySelector(".paid-today .change-limit");
let changePaidTodayForm = document.querySelector(".change-limit-form");
let changePaidTodayLimit = document.querySelector(".change-limit-form input");
let changePaidTodayDone = document.querySelector(".change-limit-form .done");
let changePaidTodayCancel = document.querySelector(
  ".change-limit-form .cancel"
);

if (localStorage.getItem("paid-today")) {
  updatePaidToday(localStorage.getItem("paid-today"));
} else {
  localStorage.setItem("paid-today", 100);
}

if (localStorage.getItem("paid-today-limit")) {
  updatePaidTodayLimit(localStorage.getItem("paid-today-limit"));
} else {
  localStorage.setItem("paid-today-limit", 100);
}

// change paid today
changePaidToday.addEventListener("click", () => {
  cover.style.display = "block";
  changePaidTodayForm.style.display = "block";

  changePaidTodayDone.addEventListener("click", () => {
    if (changePaidTodayLimit.value != "") {
      localStorage.setItem(
        "paid-today-limit",
        parseInt(changePaidTodayLimit.value)
      );
      localStorage.setItem("paid-today", parseInt(changePaidTodayLimit.value));

      updatePaidToday(localStorage.getItem("paid-today-limit"));
      updatePaidTodayLimit(localStorage.getItem("paid-today-limit"));
      editCircle();

      // close form
      cover.style.display = "none";
      changePaidTodayForm.style.display = "none";
    }
  });

  changePaidTodayCancel.addEventListener("click", () => {
    // close form
    cover.style.display = "none";
    changePaidTodayLimit.value = "";
    changePaidTodayForm.style.display = "none";
  });
});

// edit pay-today section
function updatePaidToday(newValue) {
  paidToday.innerHTML = newValue;
}

// edit pay-today-limit section
function updatePaidTodayLimit(newValue) {
  paidTodayLimit.innerHTML = newValue;
}

// check paid today every 24 hours
let paidTodayChecker = new Date();

if (localStorage.getItem("paid-Today-Date")) {
  if (localStorage.getItem("paid-Today-Date") != paidTodayChecker.getDate()) {
    localStorage.setItem("paid-Today-Date", paidTodayChecker.getDate());
    localStorage.setItem(
      "paid-today",
      localStorage.getItem("paid-today-limit")
    );
    paidToday.innerHTML = localStorage.getItem("paid-today-limit");
    editCircle();
  }
} else {
  localStorage.setItem("paid-Today-Date", 0);
}

// edit balance value
function updateBalance() {
  balanceEl.innerHTML = localStorage.getItem("balance") + "₺";
}

// edit balance value by form

let A_amountInput = document.querySelector(".balance-add-form .amount");
let R_amountInput = document.querySelector(".balance-remove-form .amount");
let A_descriptionInput = document.querySelector(
  ".balance-add-form .description"
);
let R_descriptionInput = document.querySelector(
  ".balance-remove-form .description"
);

function addMoneyByForm() {
  if (addForm.style.display != "none") {
    A_doneBtn.addEventListener("click", () => {
      if (A_amountInput.value != "" && A_descriptionInput.value != "") {
        let newBalance =
          parseInt(localStorage.getItem("balance")) +
          parseInt(A_amountInput.value);
        localStorage.setItem("balance", newBalance);
        updateBalance();

        let activityDate = new Date();

        let newBox = {
          description: A_descriptionInput.value,
          amount: parseInt(A_amountInput.value),
          date: `${activityDate.getDate()}/${
            activityDate.getMonth() + 1
          }/${activityDate.getFullYear()} ${activityDate.getHours()}:${activityDate.getMinutes()}:${activityDate.getSeconds()}`,
          caret: "in",
        };

        boxesArr.unshift(newBox);
        localStorage.setItem("boxes", JSON.stringify(boxesArr));
        updateActivity();

        // close form
        A_amountInput.value = "";
        cover.style.display = "none";
        A_descriptionInput.value = "";
        addForm.style.display = "none";
      }
    });
  }
}

A_cancelBtn.addEventListener("click", () => {
  A_amountInput.value = "";
  cover.style.display = "none";
  A_descriptionInput.value = "";
  addForm.style.display = "none";
});

function removeMoneyByForm() {
  if (removeForm.style.display != "none") {
    R_doneBtn.addEventListener("click", () => {
      if (R_amountInput.value != "" && R_descriptionInput.value != "") {
        let newBalance =
          parseInt(localStorage.getItem("balance")) -
          parseInt(R_amountInput.value);
        localStorage.setItem("balance", newBalance);
        updateBalance();

        let newPaidToday =
          parseInt(paidToday.innerHTML) - parseInt(R_amountInput.value);
        localStorage.setItem("paid-today", newPaidToday);
        updatePaidToday(newPaidToday);

        editCircle();

        let activityDate = new Date();

        let newBox = {
          description: R_descriptionInput.value,
          amount: parseInt(R_amountInput.value),
          date: `${activityDate.getDate()}/${
            activityDate.getMonth() + 1
          }/${activityDate.getFullYear()} ${activityDate.getHours()}:${activityDate.getMinutes()}:${activityDate.getSeconds()}`,
          caret: "out",
        };

        boxesArr.unshift(newBox);
        localStorage.setItem("boxes", JSON.stringify(boxesArr));
        updateActivity();

        checkNotifications();

        // close form
        R_amountInput.value = "";
        cover.style.display = "none";
        R_descriptionInput.value = "";
        removeForm.style.display = "none";
      }
    });
  }
}

R_cancelBtn.addEventListener("click", () => {
  R_amountInput.value = "";
  cover.style.display = "none";
  R_descriptionInput.value = "";
  removeForm.style.display = "none";
});

function editCircle() {
  if (localStorage.getItem("paid-today") < 0) {
    circle.style["stroke-dashoffset"] = 472;
  } else {
    circle.style["stroke-dashoffset"] =
      472 -
      (472 * localStorage.getItem("paid-today")) /
        localStorage.getItem("paid-today-limit") +
      15;
  }
}

// activity section

function updateActivity() {
  boxesDiv.innerHTML = "";

  let data = JSON.parse(localStorage.getItem("boxes"));

  if (localStorage.getItem("boxes")) {
    for (let i = 0; i < data.length; i++) {
      let boxDiv = document.createElement("div");
      boxDiv.className = "box";

      let descriptionDiv = document.createElement("div");
      descriptionDiv.className = "description";
      descriptionDiv.append(data[i].description);

      let amountDiv = document.createElement("div");
      amountDiv.className = "amount";
      amountDiv.append(data[i].amount + "₺");

      let dateDiv = document.createElement("div");
      dateDiv.className = "date";
      dateDiv.append(data[i].date);

      let caretDiv = document.createElement("div");
      caretDiv.className = "caret";
      if (data[i].caret == "in") {
        let iCaret = document.createElement("i");
        iCaret.className = "fa-solid fa-caret-up";
        caretDiv.appendChild(iCaret);
      } else if (data[i].caret == "out") {
        let iCaret = document.createElement("i");
        iCaret.className = "fa-solid fa-caret-down";
        caretDiv.appendChild(iCaret);
      }

      boxDiv.appendChild(descriptionDiv);
      boxDiv.appendChild(amountDiv);
      boxDiv.appendChild(dateDiv);
      boxDiv.appendChild(caretDiv);

      boxesDiv.appendChild(boxDiv);
    }
  }
}

// notifications
let notificationBtn = document.querySelector("header nav i");
let notifications = document.querySelector(".notifications");
let redDot = document.querySelector("header i div");
let okBtn = document.querySelector(".notifications .ok");

function checkNotifications() {
  if (localStorage.getItem("paid-today") < 10) {
    redDot.classList.add("block");
    notificationBtn.addEventListener("click", () => {
      notifications.classList.toggle("block");
    });
  }
  okBtn.addEventListener("click", () => {
    notifications.classList.remove("block");
    redDot.classList.remove("block");
  });
}

// localStorage.clear()
