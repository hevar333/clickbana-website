// language-selector.js
const LanguageSelector = (() => {
  // Private variables
  let selectedOption, optionsContainer, languageSearch, options, currentLangSpan;

  // Public method to initialize the selector
  function init(container) {
    // Create the HTML structure
    const html = `
    <div class="language-selector">
      <div id="selectedOption">
        <span class="selected-text"></span>
        <div class="arrow"></div>
        <input type="text" class="search-input" id="languageSearch" placeholder="Search languages...">
      </div>
      <div id="optionsContainer">
        <div class="option" data-value="english">English</div>
        <div class="option" data-value="sorani">Kurdish (Sorani)</div>
        <div class="option" data-value="kurmanji">Kurdish (Kurmanji)</div>
        <div class="option" data-value="arabic">Arabic</div>
        <div class="scroll-indicator"></div>
      </div>
    </div>
    `;

    // Inject into container
    container.innerHTML = html;

    // Get references to elements
    selectedOption = container.querySelector('#selectedOption');
    optionsContainer = container.querySelector('#optionsContainer');
    languageSearch = container.querySelector('#languageSearch');
    options = container.querySelectorAll('.option');
    currentLangSpan = selectedOption.querySelector('.selected-text');

    // Initialize component
    setCurrentLanguage();
    setupEventListeners();
  }

  // Set current language based on URL
  function setCurrentLanguage() {
    const path = window.location.pathname.toLowerCase();

    if (path.includes('./english1.html')) {
      currentLangSpan.textContent = 'english';
    } else if (path.includes('./sorani1.html')) {
      currentLangSpan.textContent = 'kurdish (Sorani)';
    } else if (path.includes('./kurdishku.html')) {
      currentLangSpan.textContent = 'kurdish (Kurmanji)';
    } else if (path.includes('./arabic1.html')) {
      currentLangSpan.textContent = 'arabic';
    } else {
      currentLangSpan.textContent = 'Select Language';
    }
  }

  // Toggle dropdown visibility
  function toggleDropdown() {
    if (optionsContainer.style.display === 'none' || !optionsContainer.style.display) {
      optionsContainer.style.display = 'block';
      languageSearch.style.display = 'block';
      languageSearch.focus();
      selectedOption.querySelector('.arrow').classList.add('open');
    } else {
      optionsContainer.style.display = 'none';
      languageSearch.style.display = 'none';
      languageSearch.value = '';
      selectedOption.querySelector('.arrow').classList.remove('open');
      options.forEach(option => {
        option.classList.remove('hidden');
      });
    }
  }

  // Search functionality
  function handleSearch() {
    const searchTerm = this.value.toLowerCase();

    options.forEach(option => {
      const text = option.textContent.toLowerCase();
      option.classList.toggle('hidden', !text.includes(searchTerm));
    });
  }

  // Select an option
  function selectOption() {
    const value = this.getAttribute('data-value');
    const text = this.textContent;

    // Update selected display
    currentLangSpan.textContent = text;

    // Hide dropdown
    optionsContainer.style.display = 'none';
    languageSearch.style.display = 'none';
    languageSearch.value = '';
    selectedOption.querySelector('.arrow').classList.remove('open');

    // Reset options visibility
    options.forEach(opt => opt.classList.remove('hidden'));

    // Navigate to selected language page
    navigateToLanguage(value);
  }

  // Close dropdown when clicking outside
  function handleOutsideClick(e) {
    if (!selectedOption.contains(e.target) && !optionsContainer.contains(e.target)) {
      optionsContainer.style.display = 'none';
      languageSearch.style.display = 'none';
      languageSearch.value = '';
      selectedOption.querySelector('.arrow').classList.remove('open');
      options.forEach(opt => opt.classList.remove('hidden'));
    }
  }

  // Navigate to language page
  function navigateToLanguage(language) {
    let pagePath = '';

    switch(language) {
      case 'english':
        pagePath = './english1.html';
        break;
      case 'sorani':
        pagePath = './sorani1.html';
        break;
      case 'kurmanji':
        pagePath = './kurdishku.html';
        break;
      case 'arabic':
        pagePath = './arabic1.html';
        break;
      default:
        console.log('Unknown language:', language);
        return;
    }

    if (pagePath) {
      window.location.href = pagePath;
    }
  }

  // Set up event listeners
  function setupEventListeners() {
    selectedOption.addEventListener('click', function(e) {
      if (e.target === languageSearch) return;
      toggleDropdown();
    });

    languageSearch.addEventListener('input', handleSearch);

    options.forEach(option => {
      option.addEventListener('click', selectOption);
    });

    document.addEventListener('click', handleOutsideClick);
  }

  // Public API
  return {
    init
  };
})();

export { LanguageSelector };
