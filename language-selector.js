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
    
    // Set initial visibility states
    optionsContainer.style.display = 'none';
    languageSearch.style.display = 'none';
  }

  // Set current language based on URL
  function setCurrentLanguage() {
    const path = window.location.pathname.toLowerCase();
    let langText = 'Select Language';

    if (path.includes('/english1.html') || path.includes('english1.html')) {
      langText = 'English';
    } else if (path.includes('/sorani1.html') || path.includes('sorani1.html')) {
      langText = 'Kurdish (Sorani)';
    } else if (path.includes('/kurdishku.html') || path.includes('kurdishku.html')) {
      langText = 'Kurdish (Kurmanji)';
    } else if (path.includes('/arabic1.html') || path.includes('arabic1.html')) {
      langText = 'Arabic';
    }

    currentLangSpan.textContent = langText;
    
    // Set active option
    options.forEach(option => {
      option.classList.toggle('active', option.textContent === langText);
    });
  }

  // Toggle dropdown visibility
  function toggleDropdown() {
    if (optionsContainer.style.display === 'block') {
      closeDropdown();
    } else {
      openDropdown();
    }
  }

  function openDropdown() {
    optionsContainer.style.display = 'block';
    languageSearch.style.display = 'block';
    languageSearch.focus();
    selectedOption.querySelector('.arrow').classList.add('open');
  }

  function closeDropdown() {
    optionsContainer.style.display = 'none';
    languageSearch.style.display = 'none';
    languageSearch.value = '';
    selectedOption.querySelector('.arrow').classList.remove('open');
    resetSearch();
  }

  function resetSearch() {
    options.forEach(option => {
      option.classList.remove('hidden');
    });
  }

  // Search functionality
  function handleSearch() {
    const searchTerm = this.value.toLowerCase().trim();
    
    options.forEach(option => {
      const text = option.textContent.toLowerCase();
      option.classList.toggle('hidden', !text.includes(searchTerm));
    });
  }

  // Select an option
  function selectOption() {
    const value = this.getAttribute('data-value');
    const text = this.textContent;

    // Only navigate if it's a different language
    if (currentLangSpan.textContent !== text) {
      // Update selected display
      currentLangSpan.textContent = text;
      
      // Navigate to selected language page
      navigateToLanguage(value);
    } else {
      closeDropdown();
    }
  }

  // Close dropdown when clicking outside
  function handleOutsideClick(e) {
    if (!selectedOption.contains(e.target) && !optionsContainer.contains(e.target)) {
      closeDropdown();
    }
  }

  // Navigate to language page
  function navigateToLanguage(language) {
    const pageMap = {
      'english': './english1.html',
      'sorani': './sorani1.html',
      'kurmanji': './kurdishku.html',
      'arabic': './arabic1.html'
    };

    const pagePath = pageMap[language];
    if (pagePath) window.location.href = pagePath;
  }

  // Set up event listeners
  function setupEventListeners() {
    // Toggle dropdown when clicking selected area (except search input)
    selectedOption.addEventListener('click', (e) => {
      if (e.target !== languageSearch) toggleDropdown();
    });

    // Prevent clicks inside dropdown from closing it
    optionsContainer.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    languageSearch.addEventListener('input', handleSearch);

    options.forEach(option => {
      option.addEventListener('click', selectOption);
    });

    document.addEventListener('click', handleOutsideClick);
    
    // Close dropdown on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDropdown();
    });
  }

  // Public API
  return {
    init
  };
})();

export { LanguageSelector };
