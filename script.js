// ------------------ Expense Tracker Logic ------------------
// Note: Data is kept in memory for this session (no localStorage used here).

const transactionForm = document.getElementById('transactionForm');
const titleInput = document.getElementById('title');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('date');
const filterCategory = document.getElementById('filterCategory');

const transactionList = document.getElementById('transactionList');
const emptyMsg = document.getElementById('emptyMsg');

const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');
const totalBalanceEl = document.getElementById('totalBalance');

let transactions = [];

// Default the date field to today
dateInput.value = new Date().toISOString().split('T')[0];

// Handle new transaction submission
transactionForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const newTransaction = {
    id: Date.now(),
    title: titleInput.value.trim(),
    amount: parseFloat(amountInput.value),
    type: typeInput.value,
    category: categoryInput.value,
    date: dateInput.value,
  };

  if (!newTransaction.title || isNaN(newTransaction.amount) || newTransaction.amount <= 0) {
    return;
  }

  transactions.unshift(newTransaction);
  renderTransactions();
  updateSummary();

  transactionForm.reset();
  dateInput.value = new Date().toISOString().split('T')[0];
  titleInput.focus();
});

// Filter transactions by category
filterCategory.addEventListener('change', renderTransactions);

// Delete a transaction
function deleteTransaction(id) {
  transactions = transactions.filter((tx) => tx.id !== id);
  renderTransactions();
  updateSummary();
}

// Render the transaction list based on the current filter
function renderTransactions() {
  const selectedCategory = filterCategory.value;
  const filtered =
    selectedCategory === 'All'
      ? transactions
      : transactions.filter((tx) => tx.category === selectedCategory);

  transactionList.innerHTML = '';

  if (filtered.length === 0) {
    emptyMsg.style.display = 'block';
    return;
  }
  emptyMsg.style.display = 'none';

  filtered.forEach((tx) => {
    const li = document.createElement('li');
    li.classList.add('transaction-item', tx.type);

    const formattedDate = new Date(tx.date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    li.innerHTML = `
      <div class="tx-info">
        <h4>${escapeHtml(tx.title)}</h4>
        <span>${tx.category} • ${formattedDate}</span>
      </div>
      <div class="tx-amount">
        <span class="${tx.type === 'income' ? 'income-amt' : 'expense-amt'}">
          ${tx.type === 'income' ? '+' : '-'}৳${tx.amount.toFixed(2)}
        </span>
        <button class="delete-btn" data-id="${tx.id}">Delete</button>
      </div>
    `;

    transactionList.appendChild(li);
  });

  // Attach delete listeners
  document.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      deleteTransaction(Number(btn.getAttribute('data-id')));
    });
  });
}

// Recalculate and display totals
function updateSummary() {
  const income = transactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const expense = transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  totalIncomeEl.textContent = `৳${income.toFixed(2)}`;
  totalExpenseEl.textContent = `৳${expense.toFixed(2)}`;
  totalBalanceEl.textContent = `৳${(income - expense).toFixed(2)}`;
}

// Prevent basic HTML injection in the title field
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Initial render
renderTransactions();
updateSummary();
