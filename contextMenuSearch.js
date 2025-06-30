// contextMenuSearch.js
export default function initContextMenuSearch(menuElement, queryInput) {
    let selectedText = '';
    let lastRightClick = { x: 0, y: 0 };

    // Handle text selection
    const handleMouseUp = () => {
        selectedText = window.getSelection().toString().trim();
    };

    // Show context menu on right-click
    const handleContextMenu = (e) => {
        if (selectedText) {
            e.preventDefault();
            lastRightClick = { x: e.clientX, y: e.clientY };
            
            queryInput.value = selectedText;
            positionMenu(e);
        }
    };

    // Position the context menu
    const positionMenu = (e) => {
        menuElement.style.display = 'block';
        menuElement.style.left = `${e.pageX}px`;
        menuElement.style.top = `${e.pageY}px`;

        // Adjust position if out of viewport
        const rect = menuElement.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            menuElement.style.left = `${window.innerWidth - rect.width - 10}px`;
        }
        if (rect.bottom > window.innerHeight) {
            menuElement.style.top = `${window.innerHeight - rect.height - 10}px`;
        }
    };

    // Hide menu on outside click
    const handleClick = (e) => {
        if (!menuElement.contains(e.target)) {
            menuElement.style.display = 'none';
        }
    };

    // Handle search engine selection
    const handleOptionClick = (e) => {
        const engine = e.target.dataset.engine;
        const query = queryInput.value.trim();
        if (!query) return;

        const engines = {
            chatgpt: `https://chat.openai.com/?q=${encodeURIComponent(query)}`,
            copilot: `https://copilot.microsoft.com/?q=${encodeURIComponent(query)}`
        };

        if (engines[engine]) {
            window.open(engines[engine], '_blank');
            menuElement.style.display = 'none';
        }
    };

    // Handle Enter key in search input
    const handleKeydown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const firstOption = menuElement.querySelector('.search-option');
            if (firstOption) firstOption.click();
        }
    };

    // Add event listeners
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);
    queryInput.addEventListener('keydown', handleKeydown);
    
    // Use event delegation for search options
    menuElement.addEventListener('click', (e) => {
        if (e.target.classList.contains('search-option')) {
            handleOptionClick(e);
        }
    });

    // Return cleanup function
    return () => {
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('click', handleClick);
        queryInput.removeEventListener('keydown', handleKeydown);
        menuElement.removeEventListener('click', handleOptionClick);
    };
}