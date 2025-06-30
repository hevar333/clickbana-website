export const arabicMappings = {
   'Backquote': { base: 'ذ', shift: '~' },
  'Digit1': { base: '١', shift: '!' },
  'Digit2': { base: '٢', shift: '@' },
  'Digit3': { base: '٣', shift: '#' },
  'Digit4': { base: '٤', shift: '$' },
  'Digit5': { base: '٥', shift: '%' },
  'Digit6': { base: '٦', shift: '^' },
  'Digit7': { base: '٧', shift: '&' },
  'Digit8': { base: '٨', shift: '*' },
  'Digit9': { base: '٩', shift: '(' },
  'Digit0': { base: '٠', shift: ')' },
  'Minus': { base: '-', shift: '_' },
  'Equal': { base: '=', shift: '+' },

  // Second row
  'KeyQ': { base: 'ض', shift: 'َ' },
  'KeyW': { base: 'ص', shift: 'ً' },
  'KeyE': { base: 'ث', shift: 'ُ' },
  'KeyR': { base: 'ق', shift: 'ق' },
  'KeyT': { base: 'ف', shift: 'ف' },
  'KeyY': { base: 'غ', shift: 'إ' },
  'KeyU': { base: 'ع', shift: '‘' },
  'KeyI': { base: 'ه', shift: 'ه' },
  'KeyO': { base: 'خ', shift: 'خ' },
  'KeyP': { base: 'ح', shift: '؛' },
  'BracketLeft': { base: 'ج', shift: '{' },
  'BracketRight': { base: 'د', shift: '}' },
  'Backslash': { base: '\\', shift: "ّ" },

  // Third row
  'KeyA': { base: 'ش', shift: '\\' },
  'KeyS': { base: 'س', shift: 'س' },
  'KeyD': { base: 'ي', shift: ']' },
  'KeyF': { base: 'ب', shift: '[' },
  'KeyG': { base: 'ل', shift: 'ل' },
  'KeyH': { base: 'ا', shift: 'ا' },
  'KeyJ': { base: 'ت', shift: 'ت' },
  'KeyK': { base: 'ن', shift: '،' },
  'KeyL': { base: 'م', shift: '/' },
  'Semicolon': { base: 'ك', shift: ':' },
  'Quote': { base: 'ط', shift: '"' },

  // Fourth row
  'KeyZ': { base: 'ئ', shift: '~' },
  'KeyX': { base: 'ء', shift: 'ْ' },
  'KeyC': { base: 'ؤ', shift: 'ِ' },
  'KeyV': { base: 'ر', shift: 'ٍ' },
  'KeyB': { base: 'لا', shift: 'ى' },
  'KeyN': { base: 'ى', shift: 'ة' },
  'KeyM': { base: 'ة', shift: '-' },
  'Comma': { base: 'و', shift: ',' },
  'Period': { base: 'ز', shift: '.' },
  'Slash': { base: 'ظ', shift: '؟' },

  // Modifier keys (unchanged)
  'ControlLeft': { base: 'Ctrl', shift: 'Ctrl' },
  'MetaLeft': { base: '❖', shift: '❖' },
  'AltLeft': { base: 'Alt', shift: 'Alt' },
  'Space': { base: ' ', shift: ' ' },
  'AltRight': { base: 'Alt', shift: 'Alt' },
  'ControlRight': { base: 'Ctrl', shift: 'Ctrl' }
};

export function setupArabicKeyboardMapping(editor, showToast) {
  let kbMappingEnabled = true;

  function arabicPhysicalKeyboardHandler(event) {
    if (!kbMappingEnabled) return;

    // Skip shortcut combinations
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    // Only handle printable keys
    if (arabicMappings.hasOwnProperty(event.code)) {
      const active = document.activeElement;
      // Only prevent default if focused in editor or input/textarea
      if (
        active === editor ||
        (active && (active.tagName === 'TEXTAREA' || active.tagName === 'INPUT'))
      ) {
        event.preventDefault();
        const isShift = event.shiftKey;
        const keyInfo = arabicMappings[event.code];
        const char = isShift ? keyInfo.shift : keyInfo.base;

        if (active === editor) {
          document.execCommand('insertText', false, char);
        } else {
          const el = document.activeElement;
          const start = el.selectionStart;
          const end = el.selectionEnd;
          el.value = el.value.substring(0, start) + char + el.value.substring(end);
          el.selectionStart = el.selectionEnd = start + char.length;
          
          // Trigger input event for reactive frameworks
          el.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    }
  }

  function updateKbMappingHandler() {
    document.removeEventListener('keydown', arabicPhysicalKeyboardHandler, true);
    if (kbMappingEnabled) {
      document.addEventListener('keydown', arabicPhysicalKeyboardHandler, true);
    }
  }

  // Initialize handler
  updateKbMappingHandler();

  return {
    setEnabled(state) {
      kbMappingEnabled = state;
      updateKbMappingHandler();
      if (showToast) {
        showToast(state ? 
          "تم تفعيل لوحة المفاتيح العربية" : 
          "تم تعطيل لوحة المفاتيح العربية"
        );
      }
    },
    getEnabled() {
      return kbMappingEnabled;
    },
    cleanup() {
      document.removeEventListener('keydown', arabicPhysicalKeyboardHandler, true);
    }
  };
}