// =========================================================
//  Expense Tracker — complete solution
// =========================================================

// ----------------------------------------------------------
// STEP 1: Data
// ----------------------------------------------------------
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let selectedType = "income";

// ----------------------------------------------------------
// STEP 2: setType()
// ----------------------------------------------------------
function setType(type) {
  selectedType = type;

  const incomeBtn = document.getElementById("btn-income");
  const expenseBtn = document.getElementById("btn-expense");

  incomeBtn.className = "type-btn";
  expenseBtn.className = "type-btn";

  if (type === "income") {
    incomeBtn.classList.add("active", "income-active");
  } else {
    expenseBtn.classList.add("active", "expense-active");
  }
}

// ----------------------------------------------------------
// STEP 3: addTransaction()
// ----------------------------------------------------------
function addTransaction() {
  const description = document.getElementById("description").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;
  const errorMsg = document.getElementById("error-msg");

  if (!description) {
    errorMsg.textContent = "Please enter a description.";
    return;
  }
  if (isNaN(amount) || amount <= 0) {
    errorMsg.textContent = "Please enter a valid positive amount.";
    return;
  }
  errorMsg.textContent = "";

  const transaction = {
    id: Date.now(),
    description,
    amount,
    type: selectedType,
    category,
    date: new Date().toISOString().split("T")[0]
  };

  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  renderTransactions();

  document.getElementById("description").value = "";
  document.getElementById("amount").value = "";
}

// ----------------------------------------------------------
// STEP 4: deleteTransaction()
// ----------------------------------------------------------
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  renderTransactions();
}

// ----------------------------------------------------------
// STEP 5: updateSummary()
// ----------------------------------------------------------
function updateSummary() {
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const fmt = (n) => "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  document.getElementById("balance").textContent = fmt(balance);
  document.getElementById("total-income").textContent = fmt(totalIncome);
  document.getElementById("total-expense").textContent = fmt(totalExpense);
}

// ----------------------------------------------------------
// STEP 6: renderTransactions()
// ----------------------------------------------------------
function renderTransactions() {
  const searchText = document.getElementById("search").value.toLowerCase();
  const filterCategory = document.getElementById("filter-category").value;
  const list = document.getElementById("tx-list");
  const emptyMsg = document.getElementById("empty-msg");

  let filtered = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchText);
    const matchesCategory = filterCategory === "All" || t.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  list.innerHTML = "";

  if (filtered.length === 0) {
    emptyMsg.style.display = "block";
  } else {
    emptyMsg.style.display = "none";

    filtered.slice().reverse().forEach(t => {
      const li = document.createElement("li");
      li.className = "tx-item";

      const sign = t.type === "income" ? "+" : "−";
      const dateObj = new Date(t.date);
      const dateStr = dateObj.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
      const amountStr = "₹" + t.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 });

      li.innerHTML = `
        <div class="tx-dot ${t.type}"></div>
        <div class="tx-info">
          <div class="tx-desc">${t.description}</div>
          <div class="tx-meta">${t.category}</div>
        </div>
        <div class="tx-amount ${t.type}">${sign}${amountStr}</div>
        <div class="tx-date">${dateStr}</div>
        <button class="delete-btn" onclick="deleteTransaction(${t.id})">✕</button>
      `;

      list.appendChild(li);
    });
  }

  updateSummary();
}

// ----------------------------------------------------------
// STEP 7: Initialise
// ----------------------------------------------------------
setType("income");
renderTransactions();
