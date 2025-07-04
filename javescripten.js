import { emojiCategories, populateEmojiPanel } from './emoji-data.js';
import { setupKeyboardMapping } from './keyboardMapping.js';
import { LanguageSelector } from './language-selector.js';
import initContextMenuSearch from './contextMenuSearch.js';
  const editor = document.getElementById('text-input');
  const wordCountEl = document.getElementById('wordCount');
  const charCountEl = document.getElementById('charCount');
  const darkModeToggle = document.getElementById('darkModeToggle');
  const darkModeText = document.querySelector('.dark-mode-text');
  const darkModeIcon = darkModeToggle.querySelector('i');
  const toast = document.getElementById('toast');
  const emojiButton = document.getElementById('emojiButton');
  const emojiPanel = document.getElementById('emojiPanel');

  const formatButtons = document.querySelectorAll('.format');
  const alignButtons = document.querySelectorAll('.align');
  const fontSize = document.getElementById('fontSize');
  const formatBlock = document.getElementById('formatBlock');
  const foreColor = document.getElementById('foreColor');
  const backColor = document.getElementById('backColor');
  const clearAllBtn = document.getElementById('clearAll');
  const copyAllBtn = document.getElementById('copyAll');

  const keyboardContainer = document.getElementById('englishKeyboard');
  const toggleButton = document.getElementById('toggleKeyboard');
  const closeButton = document.getElementById('closeKeyboard');
  const backspaceKey = document.getElementById('backspaceKey');
  const shiftKey = document.getElementById('shiftKey');
  const enterKey = document.getElementById('enterKey');
  const capsLockKey = document.getElementById('capsLockKey');
  const shiftIndicator = document.getElementById('shiftIndicator');
  const capsIndicator = document.getElementById('capsIndicator');

  // Keyboard states
  let isShifted = false;
  let isCapsLock = false;
  // Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const kbToggle = document.getElementById('kbMappingToggle');
  
  // Initialize keyboard mapping
  const keyboardMapping = setupKeyboardMapping(editor, showToast);
  
  // Set initial state from toggle
  keyboardMapping.setEnabled(kbToggle.checked);
  
  // Connect toggle button
  kbToggle.addEventListener('change', (e) => {
    keyboardMapping.setEnabled(e.target.checked);
    showToast(e.target.checked ? 
      "English keyboard enabled" : 
      "English keyboard disabled"
    );
  });
  
  // Cleanup when needed (optional)
  // window.addEventListener('beforeunload', () => keyboardMapping.cleanup());
});

  // Show toast notification
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
  
  // Update keyboard state indicators
  function updateStateIndicators() {
    shiftIndicator.classList.toggle('active', isShifted);
    capsIndicator.classList.toggle('active', isCapsLock);
  }

  // Toggle shift state
  function toggleShiftState() {
    isShifted = !isShifted;
    shiftKey.classList.toggle('active', isShifted);
    keyboardContainer.classList.toggle('shift-active', isShifted);
    updateStateIndicators();
    updateKeyLabels();
    showToast(isShifted ? "Shift activated" : "Shift deactivated");
  }

  // Toggle caps lock state
  function toggleCapsLock() {
    isCapsLock = !isCapsLock;
    capsLockKey.classList.toggle('active', isCapsLock);
    updateStateIndicators();
    updateKeyLabels();
    showToast(isCapsLock ? "Caps Lock activated" : "Caps Lock deactivated");
  }

  // Update key labels based on shift state
  function updateKeyLabels() {
    const keys = document.querySelectorAll('.keyboard-key[data-key]');
    keys.forEach(key => {
      const dataKey = key.getAttribute('data-key');
      const dataShift = key.getAttribute('data-shift');
      
      if (key.classList.contains('letter')) {
        if (isCapsLock) {
          key.textContent = isShifted ? dataKey : dataShift;
        } else {
          key.textContent = isShifted ? dataShift : dataKey;
        }
      } else if (dataShift) {
        key.textContent = isShifted ? dataShift : dataKey;
      }
    });
  }

  // Check for saved dark mode preference
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-theme');
    darkModeIcon.classList.remove('fa-moon');
    darkModeIcon.classList.add('fa-sun');
    darkModeText.textContent = ' Light';
  }

  // Toggle dark mode
  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    if (document.body.classList.contains('dark-theme')) {
      localStorage.setItem('darkMode', 'enabled');
      darkModeIcon.classList.remove('fa-moon');
      darkModeIcon.classList.add('fa-sun');
      darkModeText.textContent = ' Light';
    } else {
      localStorage.setItem('darkMode', 'disabled');
      darkModeIcon.classList.remove('fa-sun');
      darkModeIcon.classList.add('fa-moon');
      darkModeText.textContent = ' Dark';
    }
  });

  // Toggle emoji panel
  emojiButton.addEventListener('click', () => {
    emojiPanel.classList.toggle('active');
    // Close other panels when emoji panel is opened
    if (emojiPanel.classList.contains('active')) {
      keyboardContainer.style.display = 'none';
      toggleButton.classList.remove('active');
    }
  });

  // Close emoji panel when clicking outside
  document.addEventListener('click', (e) => {
    if (!emojiPanel.contains(e.target) && e.target !== emojiButton) {
      emojiPanel.classList.remove('active');
    }
  });


  // Command execution
  function executeCommand(command, value = null) {
    document.execCommand(command, false, value);
    editor.focus();
    updateButtonStates();
    updateWordCount();
  }

  // Button states
  function updateButtonStates() {
    formatButtons.forEach(button => {
      const command = button.id;
      button.classList.toggle('active', document.queryCommandState(command));
    });
  }

  // Word/Character counts
  function updateWordCount() {
    const text = editor.innerText || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;

    wordCountEl.textContent = `Words: ${words}`;
    charCountEl.textContent = `Characters: ${characters}`;
  }

  // Link insertion
  function createLink() {
    const url = prompt('Enter link URL:', 'https://');
    if (url) {
      const selection = window.getSelection();
      
      if (!selection.toString().trim()) {
        const linkText = prompt('Enter link text:', 'Link');
        if (linkText) {
          const a = document.createElement('a');
          a.href = url;
          a.textContent = linkText;
          a.style.color = 'var(--link-color)';
          a.style.textDecoration = 'underline';
          
          const range = selection.getRangeAt(0);
          range.insertNode(a);
          range.collapse(false);
        }
      } else {
        document.execCommand('createLink', false, url);
      }
      
      editor.focus();
      updateWordCount();
    }
  }

  // Search functionality
  function performSearch(engine) {
    const selection = window.getSelection().toString().trim();
    if (selection) {
      let url;
      switch (engine) {
        case 'google':
          url = `https://www.google.com/search?q=${encodeURIComponent(selection)}`;
          break;
        case 'youtube':
          url = `https://www.youtube.com/results?search_query=${encodeURIComponent(selection)}`;
          break;
        case 'twitter':
          url = `https://twitter.com/search?q=${encodeURIComponent(selection)}`;
          break;
        case 'facebook':
          url = `https://www.facebook.com/search/top/?q=${encodeURIComponent(selection)}`;
          break;
        default:
          return;
      }
      window.open(url, '_blank');
    } else {
      showToast('Please select some text to search');
    }
  }

  // Clear all text
  function clearAllText() {
    if (confirm('Are you sure you want to clear all text?')) {
      editor.innerHTML = '';
      editor.focus();
      updateWordCount();
      showToast('All text cleared');
    }
  }

  // Copy all text to clipboard
  function copyAllText() {
    // Create a temporary textarea to hold the text
    const textArea = document.createElement('textarea');
    textArea.value = editor.innerText;
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        showToast('Text copied to clipboard');
      } else {
        showToast('Failed to copy text');
      }
    } catch (err) {
      showToast('Failed to copy text');
    }
    
    // Clean up
    document.body.removeChild(textArea);
  }
  
  // Escape HTML for printing
  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  
  // Print text only
 function printTextOnly() {
    const textToPrint = editor.innerHTML;
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
        printWindow.document.write(`
<html>
<head>
  <title>Print</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 1cm;
      background-color: #fff;
    }
  </style>
</head>
<body>${textToPrint}</body>
</html>
`);
        printWindow.document.close();
        printWindow.focus();
        
        // Delay print to ensure content loads
        setTimeout(() => {
            printWindow.print();
            printWindow.onafterprint = () => printWindow.close();
        }, 100);
    } else {
        alert('Please allow popups for this site');
    }
}
  
  // Download as text file
  function downloadAsTxt() {
    const text = editor.innerText;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'english-text.txt';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
    showToast('File downloaded');
  }

  // Event Listeners
  formatBlock.addEventListener('change', () => {
    const selectedValue = formatBlock.value;

    if (selectedValue.includes('-custom')) {
      const className = selectedValue;
      const currentSelection = window.getSelection();

      if (currentSelection.rangeCount) {
        const range = currentSelection.getRangeAt(0);
        const selectedContent = range.extractContents();
        const newElement = document.createElement('div');

        newElement.className = className;
        newElement.appendChild(selectedContent);
        range.insertNode(newElement);

        if (newElement.parentNode && newElement.parentNode.nodeName === 'DIV') {
          newElement.parentNode.normalize();
        }
      }
    } else {
      document.execCommand('formatBlock', false, `<${selectedValue}>`);
    }

    editor.focus();
  });

  fontSize.addEventListener('change', () => {
    executeCommand('fontSize', fontSize.value);
  });

  foreColor.addEventListener('input', () => {
    executeCommand('foreColor', foreColor.value);
  });

  backColor.addEventListener('input', () => {
    executeCommand('backColor', backColor.value);
  });

  document.getElementById('insertOrderedList').addEventListener('click', () => {
    executeCommand('insertOrderedList');
  });
  
  document.getElementById('insertUnorderedList').addEventListener('click', () => {
    executeCommand('insertUnorderedList');
  });
  
  document.getElementById('indent').addEventListener('click', () => {
    executeCommand('indent');
  });
  
  document.getElementById('outdent').addEventListener('click', () => {
    executeCommand('outdent');
  });
  
  document.getElementById('undo').addEventListener('click', () => {
    executeCommand('undo');
  });
  
  document.getElementById('redo').addEventListener('click', () => {
    executeCommand('redo');
  });
  
  document.getElementById('createLink').addEventListener('click', createLink);
  
  document.getElementById('unlink').addEventListener('click', () => {
    executeCommand('unlink');
  });
  
  // New button event listeners
  clearAllBtn.addEventListener('click', clearAllText);
  copyAllBtn.addEventListener('click', copyAllText);
  
  document.querySelectorAll('.format').forEach(button => {
    button.addEventListener('click', () => {
      executeCommand(button.id);
    });
  });
  
  alignButtons.forEach(button => {
    button.addEventListener('click', () => {
      alignButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      executeCommand(button.id);
    });
  });

  // Search event listeners
  document.querySelectorAll('.search-option').forEach(option => {
    option.addEventListener('click', () => {
      const engine = option.getAttribute('data-engine');
      performSearch(engine);
    });
  });
  
  // Send To event listeners
  document.querySelectorAll('.sendto-option').forEach(option => {
    option.addEventListener('click', () => {
      const action = option.getAttribute('data-action');
      if (action === 'print') {
        printTextOnly();
      } else if (action === 'download-txt') {
        downloadAsTxt();
      }
    });
  });

  // Keyboard
  toggleButton.addEventListener('click', () => {
    keyboardContainer.style.display = keyboardContainer.style.display === 'block' ? 'none' : 'block';
    toggleButton.classList.toggle('active');
    updateKeyLabels();
    // Close emoji panel when keyboard is opened
    emojiPanel.classList.remove('active');
  });
  
  closeButton.addEventListener('click', () => {
    keyboardContainer.style.display = 'none';
    toggleButton.classList.remove('active');
  });
  
  backspaceKey.addEventListener('click', () => {
    document.execCommand('delete', false, null);
    editor.focus();
    updateWordCount();
  });
  
  enterKey.addEventListener('click', () => {
    document.execCommand('insertHTML', false, '<br>');
    editor.focus();
    updateWordCount();
  });
  
  shiftKey.addEventListener('click', toggleShiftState);
  
  capsLockKey.addEventListener('click', toggleCapsLock);
  
  document.querySelectorAll('.keyboard-key[data-key]').forEach(key => {
    key.addEventListener('click', () => {
      let char;
      
      // Handle letter keys differently
      if (key.classList.contains('letter')) {
        if (isCapsLock) {
          char = isShifted ? key.getAttribute('data-key') : key.getAttribute('data-shift');
        } else {
          char = isShifted ? key.getAttribute('data-shift') : key.getAttribute('data-key');
        }
      } 
      // Handle keys with shift variants
      else if (key.getAttribute('data-shift')) {
        char = isShifted ? key.getAttribute('data-shift') : key.getAttribute('data-key');
      } 
      // Handle keys without shift variants
      else {
        char = key.getAttribute('data-key');
      }
      
      document.execCommand('insertText', false, char);
      editor.focus();
      updateWordCount();
      
      // Deactivate shift after typing a character (unless caps lock is on)
      if (isShifted && !isCapsLock) {
        toggleShiftState();
      }
    });
  });

  // Physical keyboard events
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Shift') {
        isShifted = true;
        shiftKey.classList.add('active');
        keyboardContainer.classList.add('shift-active');
        updateStateIndicators();
        updateKeyLabels();
    }
    
    if (event.key === 'CapsLock') {
        event.preventDefault();
        toggleCapsLock();
    }
});
  
  document.addEventListener('keyup', function(event) {
    if (event.key === 'Shift') {
        isShifted = false;
        shiftKey.classList.remove('active');
        keyboardContainer.classList.remove('shift-active');
        updateStateIndicators();
        updateKeyLabels();
    }
});
  editor.addEventListener('input', updateWordCount);
  editor.addEventListener('keyup', updateButtonStates);
  editor.addEventListener('mouseup', updateButtonStates);
  editor.addEventListener('paste', (e) => {
   
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, text);
    updateWordCount();
  });

  document.addEventListener('DOMContentLoaded', () => {
      const container = document.getElementById('langSelectorContainer');
      LanguageSelector.init(container);
    });
   
    // Initialize context menu search functionality
       document.addEventListener('DOMContentLoaded', () => {
         const contextMenu = document.getElementById('contextMenu');
         const queryInput = document.getElementById('queryInput');
         
         
         // Initialize with DOM elements
         const cleanup = initContextMenuSearch(contextMenu, queryInput);
         
         // Later if you need to remove functionality:
         // cleanup();
     });
  
// Init
  window.addEventListener('DOMContentLoaded', () => {
       populateEmojiPanel(emojiPanel, editor, showToast);
      setupLetterKeys();
      updateWordCount();
      updateButtonStates();
    });
