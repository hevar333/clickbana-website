export const kurdishMappings = {
  // First row
  'Backquote': { base: '`', shift: '~' },
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
  'KeyQ': { base: 'ق', shift: 'ق' },
  'KeyW': { base: 'و', shift: 'وو' },
  'KeyE': { base: 'ە', shift: 'ي' },
  'KeyR': { base: 'ر', shift: 'ڕ' },
  'KeyT': { base: 'ت', shift: 'ط' },
  'KeyY': { base: 'ی', shift: 'ێ' },
  'KeyU': { base: 'ئ', shift: 'ء' },
  'KeyI': { base: 'ع', shift: 'ح' },
  'KeyO': { base: 'ۆ', shift: 'ٶ' },
  'KeyP': { base: 'پ', shift: 'ث' },
  'BracketLeft': { base: ']', shift: '}' },
  'BracketRight': { base: '[', shift: '{' },
  'Backslash': { base: '\\', shift: '|' },
  // Third row
  'KeyA': { base: 'ا', shift: 'آ' },
  'KeyS': { base: 'س', shift: 'ش' },
  'KeyD': { base: 'د', shift: 'ذ' },
  'KeyF': { base: 'ف', shift: 'إ' },
  'KeyG': { base: 'گ', shift: 'غ' },
  'KeyH': { base: 'ه', shift: 'ح' },
  'KeyJ': { base: 'ژ', shift: 'أ' },
  'KeyK': { base: 'ک', shift: 'ك' },
  'KeyL': { base: 'ل', shift: 'ڵ' },
  'Semicolon': { base: '؛', shift: ':' },
  'Quote': { base: "'", shift: '"' },
  // Fourth row
  'KeyZ': { base: 'ز', shift: 'ض' },
  'KeyX': { base: 'خ', shift: 'ص' },
  'KeyC': { base: 'ج', shift: 'چ' },
  'KeyV': { base: 'ڤ', shift: 'ة' },
  'KeyB': { base: 'ب', shift: 'ى' },
  'KeyN': { base: 'ن', shift: 'ة' },
  'KeyM': { base: 'م', shift: '-' },
  'Comma': { base: '،', shift: '<' },
  'Period': { base: '.', shift: '>' },
  'Slash': { base: '/', shift: '؟' },
  // Fifth row
  'ControlLeft': { base: 'Ctrl', shift: 'Ctrl' },
  'MetaLeft': { base: '❖', shift: '❖' },
  'AltLeft': { base: 'Alt', shift: 'Alt' },
  'Space': { base: ' ', shift: ' ' },
  'AltRight': { base: 'Alt', shift: 'Alt' },
  'ControlRight': { base: 'Ctrl', shift: 'Ctrl' }
};

export function setupKurdishKeyboardMapping(editor, showToast) {
  let kbMappingEnabled = true;

  function kurdishPhysicalKeyboardHandler(event) {
    if (!kbMappingEnabled) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    if (kurdishMappings.hasOwnProperty(event.code)) {
      event.preventDefault();
      const isShift = event.shiftKey;
      const keyInfo = kurdishMappings[event.code];
      const char = isShift ? keyInfo.shift : keyInfo.base;

      if (document.activeElement === editor) {
        document.execCommand('insertText', false, char);
      } else if (
        document.activeElement.tagName === 'TEXTAREA' ||
        document.activeElement.tagName === 'INPUT'
      ) {
        const el = document.activeElement;
        const start = el.selectionStart;
        const end = el.selectionEnd;
        el.value = el.value.substring(0, start) + char + el.value.substring(end);
        el.selectionStart = el.selectionEnd = start + char.length;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  }

  function updateKbMappingHandler() {
    document.removeEventListener('keydown', kurdishPhysicalKeyboardHandler, true);
    if (kbMappingEnabled) {
      document.addEventListener('keydown', kurdishPhysicalKeyboardHandler, true);
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
          "کلیلەدانی کوردی چالاکە" : 
          "کلیلەدانی کوردی ناچالاکە"
        );
      }
    },
    getEnabled() {
      return kbMappingEnabled;
    },
    cleanup() {
      document.removeEventListener('keydown', kurdishPhysicalKeyboardHandler, true);
    }
  };
}