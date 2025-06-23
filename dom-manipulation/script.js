let quotes = [
  { text: "Believe in yourself.", category: "Motivation" },
  { text: "The only constant is change.", category: "Philosophy" },
  { text: "Knowledge is power.", category: "Wisdom" }
];

const quoteDisplay = document.getElementById('quoteDisplay');
const categoryFilter = document.getElementById('categoryFilter');
const newQuoteBtn = document.getElementById('newQuote');

// Load quotes from localStorage
function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  if (stored) {
    quotes = JSON.parse(stored);
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Show notification message to user
function showSyncNotice(message) {
  const syncNotice = document.getElementById('syncNotice');
  syncNotice.textContent = message;
  setTimeout(() => {
    syncNotice.textContent = '';
  }, 5000);
}

// Populate dropdown from unique categories
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory) {
    categoryFilter.value = savedCategory;
  }
}

// Display random quote
function showRandomQuote() {
  const selected = categoryFilter.value;
  const filtered = selected === 'all' ? quotes : quotes.filter(q => q.category === selected);

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  quoteDisplay.textContent = filtered[randomIndex].text;

  sessionStorage.setItem('lastQuote', quoteDisplay.textContent);
}

// Filter by category and save preference
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem('selectedCategory', selected);
  showRandomQuote();
}

// Add quote and sync to server
async function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (!text || !category) {
    alert("Both quote and category are required.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  showRandomQuote();

  // POST to mock API using "Content-Type"
  await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(newQuote),
    headers: {
      "Content-Type": "application/json; charset=UTF-8"
    }
  });

  showSyncNotice("Quote also synced to server.");

  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

// Create quote input form
function createAddQuoteForm() {
  const formContainer = document.getElementById('formContainer');

  const quoteInput = document.createElement('input');
  quoteInput.id = 'newQuoteText';
  quoteInput.type = 'text';
  quoteInput.placeholder = 'Enter a new quote';

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.type = 'text';
  categoryInput.placeholder = 'Enter quote category';

  const addButton = document.createElement('button');
  addButton.id = 'addQuote';
  addButton.textContent = 'Add Quote';

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  addButton.addEventListener('click', addQuote);
}

// Required: fetch from mock API
async function fetchQuotesFromServer() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await response.json();

  // Simulate quote list
  return [
    { text: "A server-synced quote.", category: "Server" },
    { text: "Keep pushing forward.", category: "Motivation" }
  ];
}

// Required: sync with server and show exact message
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  let updated = false;

  serverQuotes.forEach(serverQuote => {
    const exists = quotes.some(local => local.text === serverQuote.text && local.category === serverQuote.category);
    if (!exists) {
      quotes.push(serverQuote);
      updated = true;
    }
  });

  if (updated) {
    saveQuotes();
    populateCategories();
    showSyncNotice("Quotes synced with server!");
  }
}

// Export quotes to JSON
function exportQuotesToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Import from uploaded JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid file format.');
      }
    } catch (error) {
      alert('Error parsing JSON file.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Event listeners
newQuoteBtn.addEventListener('click', showRandomQuote);
document.getElementById('exportBtn').addEventListener('click', exportQuotesToJson);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);

// Initialization
loadQuotes();
populateCategories();
showRandomQuote();
createAddQuoteForm();

// Restore last quote
const last = sessionStorage.getItem('lastQuote');
if (last) quoteDisplay.textContent = last;

// Periodic sync (every 30 seconds)
setInterval(syncQuotes, 30000);
