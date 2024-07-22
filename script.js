document.addEventListener('DOMContentLoaded', () => {
  const fontFamilySelector = document.getElementById('font-family-selector');
  const fontWeightSelector = document.getElementById('font-weight-selector');
  const italicToggle = document.getElementById('italic-toggle');
  const textEditor = document.getElementById('text-editor');
  const resetButton = document.getElementById('reset-button');
  const saveButton = document.getElementById('save-button');

  

  // Populate font family selector
  Object.keys(fonts).forEach(font => {
      const option = document.createElement('option');
      option.value = font;
      option.textContent = font;
      fontFamilySelector.appendChild(option);
  });

  // Handle font family change
  fontFamilySelector.addEventListener('change', (event) => {
      const selectedFont = event.target.value;
      updateFontWeights(selectedFont);
      updateEditorFont();
  });

  // Handle font weight change
  fontWeightSelector.addEventListener('change', () => {
      updateEditorFont();
  });

  // Handle italic toggle
  italicToggle.addEventListener('click', () => {
      italicToggle.classList.toggle('active');
      updateEditorFont();
  });

  // Load saved settings and content
  loadSettings();

  // Save settings on change
  fontFamilySelector.addEventListener('change', saveSettings);
  fontWeightSelector.addEventListener('change', saveSettings);
  italicToggle.addEventListener('click', saveSettings);
  textEditor.addEventListener('input', saveSettings);

  function updateFontWeights(font) {
      fontWeightSelector.innerHTML = '';
      const fontWeights = fonts[font] || {}; // Use empty object if font is undefined
      const weights = Object.keys(fontWeights);
      weights.forEach(weight => {
          const option = document.createElement('option');
          option.value = weight;
          option.textContent = weight;
          fontWeightSelector.appendChild(option);
      });

      // Automatically enable italic toggle if 'italic' is available
      const isItalicAvailable = weights.includes('italic');
      italicToggle.disabled = !isItalicAvailable;
      if (isItalicAvailable && italicToggle.classList.contains('active')) {
          italicToggle.classList.add('active');
      } else {
          italicToggle.classList.remove('active');
      }

      // Set default font weight
      if (weights.length > 0) {
          fontWeightSelector.value = weights[0];
          updateEditorFont();
      }
  }

  function updateEditorFont() {
      const selectedFont = fontFamilySelector.value;
      const selectedWeight = fontWeightSelector.value;
      const isItalic = italicToggle.classList.contains('active');
      const fontWeight = selectedWeight || '400'; // Default to '400' if no weight is selected

      let fontStyle = 'normal';
      if (isItalic) {
          fontStyle = 'italic';
      }

      const fontUrl = fonts[selectedFont]?.[selectedWeight] || fonts[selectedFont]?.['italic'];

      if (fontUrl) {
          const newFont = new FontFace(selectedFont, `url(${fontUrl})`);

          newFont.load().then((loadedFont) => {
              document.fonts.add(loadedFont);
              textEditor.style.fontFamily = selectedFont;
              textEditor.style.fontWeight = fontWeight;
              textEditor.style.fontStyle = fontStyle;
          }).catch(err => {
              console.error('Failed to load font:', err);
          });
      }
  }

  function saveSettings() {
      const settings = {
          fontFamily: fontFamilySelector.value,
          fontWeight: fontWeightSelector.value,
          isItalic: italicToggle.classList.contains('active'),
          content: textEditor.value
      };
      localStorage.setItem('textEditorSettings', JSON.stringify(settings));
  }

  function loadSettings() {
      const settings = JSON.parse(localStorage.getItem('textEditorSettings'));
      if (settings) {
          fontFamilySelector.value = settings.fontFamily || 'Arial';
          updateFontWeights(settings.fontFamily || 'Arial');
          fontWeightSelector.value = settings.fontWeight || '400';
          italicToggle.classList.toggle('active', settings.isItalic);
          textEditor.value = settings.content || '';
          updateEditorFont();
      }
  }

  // Handle reset button
  resetButton.addEventListener('click', () => {
      fontFamilySelector.value = 'Arial'; // Default font
      updateFontWeights('Arial');
      fontWeightSelector.value = '400'; // Default weight
      italicToggle.classList.remove('active');
      italicToggle.disabled = false; // Enable italic toggle if necessary
      textEditor.value = '';
      updateEditorFont();
      saveSettings(); // Save reset settings
  });

  // Handle save button
  saveButton.addEventListener('click', saveSettings);
});
