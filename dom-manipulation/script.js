let quotes = [
  { text: "Believe in yourself.", category: "Motivation" },
  { text: "The only constant is change.", category: "Philosophy" },
  { text: "Knowledge is power.", category: "Wisdom" }
];

const quoteDisplay = document.getElementById('quoteDisplay');
const categoryFilter = document.getElementById('categoryFilter');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteBtn = document.getElementById('addQuote'); // Ensure this ID matches HTML

function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
}

function showRandomQuote() {
  const selected = categoryFilter.value;
  const filtered = selected === 'all' ? quotes : quotes.filter(q => q.category === selected);
  
  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  quoteDisplay.textContent = filtered[randomIndex].text;
}

function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text, category });
  populateCategories();
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  alert("Quote added successfully!");
}

newQuoteBtn.addEventListener('click', showRandomQuote);
categoryFilter.addEventListener('change', showRandomQuote);
addQuoteBtn.addEventListener('click', addQuote); // Important!

// Initial load
populateCategories();
showRandomQuote();
