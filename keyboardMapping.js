export const englishMappings = {
'Backquote': { base: '`', shift: '~' },
  'Digit1': { base: '1', shift: '!' },
  'Digit2': { base: '2', shift: '@' },
  'Digit3': { base: '3', shift: '#' },
  'Digit4': { base: '4', shift: '$' },
  'Digit5': { base: '5', shift: '%' },
  'Digit6': { base: '6', shift: '^' },
  'Digit7': { base: '7', shift: '&' },
  'Digit8': { base: '8', shift: '*' },
  'Digit9': { base: '9', shift: '(' },
  'Digit0': { base: '0', shift: ')' },
  'Minus': { base: '-', shift: '_' },
  'Equal': { base: '=', shift: '+' },
  // Second row
  'KeyQ': { base: 'q', shift: 'Q' },
  'KeyW': { base: 'w', shift: 'W' },
  'KeyE': { base: 'e', shift: 'E' },
  'KeyR': { base: 'r', shift: 'R' },
  'KeyT': { base: 't', shift: 'T' },
  'KeyY': { base: 'y', shift: 'Y' },
  'KeyU': { base: 'u', shift: 'U' },
  'KeyI': { base: 'i', shift: 'I' },
  'KeyO': { base: 'o', shift: 'O' },
  'KeyP': { base: 'p', shift: 'P' },
  'BracketLeft': { base: '[', shift: '{' },
  'BracketRight': { base: ']', shift: '}' },
  'Backslash': { base: '\\', shift: '|' },
  // Third row
  'KeyA': { base: 'a', shift: 'A' },
  'KeyS': { base: 's', shift: 'S' },
  'KeyD': { base: 'd', shift: 'D' },
  'KeyF': { base: 'f', shift: 'F' },
  'KeyG': { base: 'g', shift: 'G' },
  'KeyH': { base: 'h', shift: 'H' },
  'KeyJ': { base: 'j', shift: 'J' },
  'KeyK': { base: 'k', shift: 'K' },
  'KeyL': { base: 'l', shift: 'L' },
  'Semicolon': { base: ';', shift: ':' },
  'Quote': { base: "'", shift: '"' },
  // Fourth row
  'KeyZ': { base: 'z', shift: 'Z' },
  'KeyX': { base: 'x', shift: 'X' },
  'KeyC': { base: 'c', shift: 'C' },
  'KeyV': { base: 'v', shift: 'V' },
  'KeyB': { base: 'b', shift: 'B' },
  'KeyN': { base: 'n', shift: 'N' },
  'KeyM': { base: 'm', shift: 'M' },
  'Comma': { base: ',', shift: '<' },
  'Period': { base: '.', shift: '>' },
  'Slash': { base: '/', shift: '?' },
  // Fifth row
  'ControlLeft': { base: 'Ctrl', shift: 'Ctrl' },
  'MetaLeft': { base: '❖', shift: '❖' },
  'AltLeft': { base: 'Alt', shift: 'Alt' },
  'Space': { base: ' ', shift: ' ' },
  'AltRight': { base: 'Alt', shift: 'Alt' },
  'ControlRight': { base: 'Ctrl', shift: 'Ctrl' }
};

let kbMappingEnabled = true;

export function setupKeyboardMapping(editor, showToast) {
  function englishPhysicalKeyboardHandler(event) {
    if (!kbMappingEnabled) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    if (englishMappings.hasOwnProperty(event.code)) {
      event.preventDefault();
      const isShift = event.shiftKey;
      const keyInfo = englishMappings[event.code];
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
    document.removeEventListener('keydown', englishPhysicalKeyboardHandler, true);
    if (kbMappingEnabled) {
      document.addEventListener('keydown', englishPhysicalKeyboardHandler, true);
    }
  }

  return {
    setEnabled(state) {
      kbMappingEnabled = state;
      updateKbMappingHandler();
    },
    getEnabled() {
      return kbMappingEnabled;
    },
    cleanup() {
      document.removeEventListener('keydown', englishPhysicalKeyboardHandler, true);
    }
  };
}