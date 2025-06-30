
        // Dark Mode Toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        const darkModeText = document.querySelector('.dark-mode-text');
        const darkModeIcon = darkModeToggle.querySelector('i');
        
        // Check for saved dark mode preference
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-theme');
            darkModeIcon.classList.remove('fa-moon');
            darkModeIcon.classList.add('fa-sun');
            darkModeText.textContent = 'Light Mode';
        }

        // Toggle dark mode
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            
            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('darkMode', 'enabled');
                darkModeIcon.classList.remove('fa-moon');
                darkModeIcon.classList.add('fa-sun');
                darkModeText.textContent = 'Light Mode';
            } else {
                localStorage.setItem('darkMode', 'disabled');
                darkModeIcon.classList.remove('fa-sun');
                darkModeIcon.classList.add('fa-moon');
                darkModeText.textContent = 'Dark Mode';
            }
        });

        // Language Selector
        (function() {
            const container = document.getElementById('langSelectorContainer');
            if (!container) return;

            if (!container.innerHTML.trim()) {
                container.innerHTML = `
                    <div id="selectedOption" aria-haspopup="true" aria-expanded="false" tabindex="0">
                        <span class="selected-text">Select Language</span>
                        <span class="arrow" aria-hidden="true">&#9662;</span>
                    </div>
                    <input id="languageSearch" type="text" placeholder="Search language..." aria-label="Search languages">
                    <div id="optionsContainer" role="listbox">
                        <div class="option" data-value="english" role="option" tabindex="0">English</div>
                        <div class="option" data-value="sorani" role="option" tabindex="0">Kurdish (Sorani)</div>
                        <div class="option" data-value="kurmanji" role="option" tabindex="0">Kurdish (Kurmanji)</div>
                        <div class="option" data-value="arabic" role="option" tabindex="0">Arabic</div>
                    </div>
                `;
            }

            const selectedOption = container.querySelector('#selectedOption');
            const optionsContainer = container.querySelector('#optionsContainer');
            const languageSearch = container.querySelector('#languageSearch');
            const options = container.querySelectorAll('.option');
            const currentLangSpan = selectedOption.querySelector('.selected-text');

            setCurrentLanguage();
            setupEventListeners();

            function setCurrentLanguage() {
                const path = window.location.pathname.toLowerCase();
                const languageMap = {
                    './english1.html': 'English',
                    './sorani1.html': 'Kurdish (Sorani)',
                    './kurdishku.html': 'Kurdish (Kurmanji)',
                    './arabic1.html': 'Arabic'
                };

                for (const [pathPart, language] of Object.entries(languageMap)) {
                    if (path.includes(pathPart)) {
                        currentLangSpan.textContent = language;
                        return;
                    }
                }
                currentLangSpan.textContent = 'Select Language';
            }

            function toggleDropdown() {
                const isExpanded = selectedOption.getAttribute('aria-expanded') === 'true';
                
                if (!isExpanded) {
                    optionsContainer.style.display = 'block';
                    languageSearch.style.display = 'block';
                    languageSearch.focus();
                    selectedOption.querySelector('.arrow').classList.add('open');
                    selectedOption.setAttribute('aria-expanded', 'true');
                } else {
                    closeDropdown();
                }
            }

            function closeDropdown() {
                optionsContainer.style.display = 'none';
                languageSearch.style.display = 'none';
                languageSearch.value = '';
                selectedOption.querySelector('.arrow').classList.remove('open');
                selectedOption.setAttribute('aria-expanded', 'false');
                options.forEach(option => {
                    option.classList.remove('hidden');
                    option.style.display = '';
                });
            }

            function handleSearch() {
                const searchTerm = this.value.toLowerCase();
                options.forEach(option => {
                    const text = option.textContent.toLowerCase();
                    const match = text.includes(searchTerm);
                    option.classList.toggle('hidden', !match);
                    option.style.display = match ? '' : 'none';
                });
            }

            function selectOption() {
                const value = this.getAttribute('data-value');
                const text = this.textContent;
                currentLangSpan.textContent = text;
                closeDropdown();
                navigateToLanguage(value);
            }

            function handleOutsideClick(e) {
                if (!container.contains(e.target)) {
                    closeDropdown();
                }
            }

            function navigateToLanguage(language) {
                const languagePaths = {
                    'english': './english1.html',
                    'sorani': './sorani1.html',
                    'kurmanji': './kurdishku.html',
                    'arabic': './arabic1.html'
                };
            
                if (languagePaths[language]) {
                    window.location.href = languagePaths[language];
                }
            }

            function setupEventListeners() {
                selectedOption.addEventListener('click', function(e) {
                    if (e.target === languageSearch) return;
                    toggleDropdown();
                });
                
                languageSearch.addEventListener('input', handleSearch);
                
                options.forEach(option => {
                    option.addEventListener('click', selectOption);
                    option.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            selectOption.call(option);
                        }
                    });
                });
                
                selectedOption.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleDropdown();
                    }
                });
                
                document.addEventListener('click', handleOutsideClick);
                
                // Close dropdown when pressing Escape
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        closeDropdown();
                    }
                });
            }
        })();
