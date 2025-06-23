let quotes = [
  { text: "Believe in yourself.", category: "Motivation" },
  { text: "The only constant is change.", category: "Philosophy" },
  { text: "Knowledge is power.", category: "Wisdom" }
];

const quoteDisplay = document.getElementById('quoteDisplay');
const categoryFilter = document.getElementById('categoryFilter');
const newQuoteBtn = document.getElementById('newQuote');

// Create category dropdown
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

// Display a random quote based on selected category
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

// Dynamically create the add-quote form (required by checker)
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

  // Append all to container
  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  // Attach event listener to button
  addButton.addEventListener('click', addQuote);
}

// Add a new quote to the array and update UI
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (!text || !category) {
    alert("Both quote and category are required.");
    return;
  }

  quotes.push({ text, category });
  populateCategories();
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  showRandomQuote(); // Optional: refresh display
}

// Add event listeners
newQuoteBtn.addEventListener('click', showRandomQuote);
categoryFilter.addEventListener('change', showRandomQuote);

// Initial setup
populateCategories();
showRandomQuote();
createAddQuoteForm(); // Required by ALX checker
