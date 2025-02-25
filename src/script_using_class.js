document.addEventListener("DOMContentLoaded", () => {
  /** 
     * Function to update the zoom level of a given element based on the window width
     * Calculates an appropriate zoom level for responsive scaling
     * @param {HTMLElement} element - The element to update zoom for
    */
  const updateZoom = (element) => {
    const windowWidth = window.innerWidth;

    // Apply zoom scaling for larger screens
    if (windowWidth >= 1200) {
      element.style.zoom = ((windowWidth - 1200) / 720) * 0.5 + 1;
    }
  };

  /** 
   * Universal function to select elements by ID or class name
   * Provides a unified interface for selecting DOM elements
   * @param {string} selector - The ID or class name of the element
   * @returns {HTMLElement[]} - An array of elements matching the selector
  */
  const getElements = (selector) => {
    if (selector.startsWith('#')) {
      const element = document.getElementById(selector.slice(1));
      return element ? [element] : [];
    } else if (selector.startsWith('.')) {
      return Array.from(document.querySelectorAll(selector));
    } else {
      console.warn(`Invalid selector '${selector}'. Use '#' for ID or '.' for class.`);
      return [];
    }
  };

  // List of Zoom Selectors (IDs or class names)
  const zoomSelectors = [".uc-scale-container", '.uc-step_title1', '.uc-step_title2', '.uc-res'];

  // Initialize zoom for each selector
  zoomSelectors.forEach((selector) => {
    const elements = getElements(selector);

    elements.forEach((element) => {
      // Initial zoom adjustment
      updateZoom(element);

      // Update zoom on window resize
      window.addEventListener("resize", () => updateZoom(element));
    });
  });

  /**
   * Begin the process of enhancing the prompt
   * Wait for the page to be ready before initializing the main functionality
   */
  t_onReady(function () {
    t_onFuncLoad('t396_init', function () {
      // 1. Declare ALL variables at the top
      // Constants and configuration
      const maxLength = 500; // Maximum length for the prompt input
      const body = {}; // Request body for API calls

      // UI element references - all initialized as null
      let appContainer = null;
      let prompt = null;
      let charCount = null;
      let enhanceBtn = null;
      let copyPromptZB = null;
      let copyPromptBtn = null;
      let responseAreaZB = null;
      let responseAreaPreContainer = null;
      let responseAreaPreTextwrapper = null;
      let responseAreaPre = null;
      let step2Title = null;
      let changeEventListener = null;
      let hasAddedListener = false;

      // Language settings
      let ai_lang = localStorage.getItem('ai_lang') || 'input';

      // Map Arabic language names to their short codes
      const languageMap = {
        "العربية": "arabic",
        "الإنجليزية": "english",
        "الالمانية": "german",
        "الإسبانية": "spanish",
        "الفرنسية": "french",
        "الروسية": "russian",
      };

      // Set the default language to 'input' when the page loads
      localStorage.setItem('ai_lang', 'input');

      // Always include ai_lang in the body object
      body.ai_lang = ai_lang;

      /**
       * Main container observer to initialize all UI elements
       * Using a centralized approach to find and set up all elements at once
       */
      const mainObserver = new Observer('#allrecords', { debounce: 50 });

      mainObserver.listenToElement('#allrecords', {
        onFound: (elements) => {
          appContainer = elements[0];
          console.log('Main container found, initializing UI elements');

          // Find all UI elements within the container
          prompt = appContainer.querySelector('textarea[name="origPrompt"]');
          charCount = appContainer.querySelector('.pxb-char-count');
          enhanceBtn = appContainer.querySelector('.pxb-enhance');
          copyPromptZB = appContainer.querySelector('.uc-copy-prompt');
          step2Title = appContainer.querySelector('.uc-step_title2');
          responseAreaZB = appContainer.querySelector('.uc-res');

          // Initialize nested elements if their parents exist
          if (charCount) {
            const charCountAtom = charCount.querySelector('.tn-atom');
            if (charCountAtom) {
              charCountAtom.classList.add('gc');
            }
          }

          if (copyPromptZB) {
            copyPromptBtn = copyPromptZB.querySelector('.pxb-copy-prompt');
            copyPromptZB.classList.add('disabled');
          }

          if (responseAreaZB) {
            responseAreaPreContainer = responseAreaZB.querySelector('.t004 .t-container');
            if (responseAreaPreContainer) {
              responseAreaPreTextwrapper = responseAreaPreContainer.querySelector('.t-text');
              if (responseAreaPreTextwrapper) {
                // Initialize <pre> tag
                responseAreaPreTextwrapper.innerHTML = '<pre class="pxb-response" style="height:auto;"></pre>';
                responseAreaPre = responseAreaZB.querySelector('.pxb-response');
              }
            }
          }

          // Set up event handlers for found elements
          if (prompt) {
            // Initialize body.prompt if not empty
            if (prompt.value.trim() !== '' && prompt.value.trim().length <= maxLength) {
              body.prompt = prompt.value.trim();
            }

            // Set up input event listener
            prompt.addEventListener('input', handlePromptInput);

            // Initialize UI state
            handlePromptInput();
          }

          if (enhanceBtn) {
            // Disable initially
            enhanceBtn.classList.add('disabled');

            // Set up click event listener
            enhanceBtn.addEventListener('click', handleEnhanceClick);
          }

          if (copyPromptBtn) {
            // Set up click event for copy button
            copyPromptBtn.addEventListener('click', function () {
              copyPrompt(this);
            });
          }

          // Log successful initialization
          console.log('UI elements initialized successfully');
        }
      });

      /**
       * Observer for the language selector
       * This is kept separate as it may be in a different part of the DOM
       */
      let languageSelectElement = new Observer('.pxb-form-lang', {
        trackReferences: true,
        debounce: 100  // 100ms debounce to prevent duplicate callbacks
      });

      // Listen for the class 'zero-form-rendered'
      languageSelectElement.listenToClass('zero-form-rendered', {
        onFound: (elements) => {
          const element = elements[0];
          console.log('Class added: zero-form-rendered');

          // Try to find the language selector inside the element
          const languageSelector = element.querySelector('select.t-select[name="res_lang"]');
          if (languageSelector && !hasAddedListener) {
            // Set up the language change handler
            setupLanguageChangeHandler(languageSelector);
          }
        },

        onRemoved: (previousElements) => {
          console.log('Class removed: zero-form-rendered');

          if (previousElements.length > 0) {
            // Clean up when the class is removed
            cleanupLanguageChangeHandler(previousElements[0]);
          }
        }
      });

      /**
       * Handle input events for the prompt textarea
       * This validates input length and updates UI accordingly
       */
      function handlePromptInput() {
        // Check if required elements exist
        if (!prompt || !charCount) return;

        let inputValue = prompt.value.trim(); // Trim whitespace

        // Check if the input has a value and enable or disable the BTN
        if (inputValue !== '' && enhanceBtn) {
          // Enable the div by removing the 'disabled' class
          enhanceBtn.classList.remove('disabled');
        } else if (enhanceBtn) {
          // Disable the BTN by adding the 'disabled' class
          enhanceBtn.classList.add('disabled');
        }

        // Truncate the input if it exceeds the maximum length
        if (inputValue.length > maxLength) {
          inputValue = inputValue.substring(0, maxLength).trim(); // Trim to max length
          prompt.value = inputValue; // Update the textarea value
        }

        // Get the character count element
        const charCountAtom = charCount.querySelector('.tn-atom');
        if (!charCountAtom) return;

        // Update the character count
        charCountAtom.innerHTML = `${inputValue.length} / ${maxLength}`;

        // Add visual feedback when the limit is reached (red color)
        if (inputValue.length >= maxLength) {
          charCountAtom.classList.remove('gc');
          charCountAtom.classList.add('ec');
        } else {
          charCountAtom.classList.remove('ec');
          charCountAtom.classList.add('gc');
        }
      }

      /**
       * Handle click on the enhance button
       * This processes the prompt and sends it to the API
       */
      async function handleEnhanceClick() {
        // Validate required elements and state
        if (!enhanceBtn || !prompt || !responseAreaPre || enhanceBtn.classList.contains('disabled')) {
          return;
        }

        let inputValue = prompt.value.trim(); // Trim whitespace

        // Validate the length
        if (inputValue.length > maxLength) {
          return; // Stop further execution
        }

        body.prompt = inputValue; // Include prompt only if it is not empty and doesn't exceed the max length

        // Update UI to indicate processing
        enhanceBtn.classList.add('disabled');
        const enhanceBtnAtom = enhanceBtn.querySelector('.tn-atom');
        if (enhanceBtnAtom) {
          enhanceBtnAtom.classList.add('progress');
          enhanceBtnAtom.innerHTML = 'ثواني ...';
        }

        // Hide copy button until response is ready
        if (copyPromptZB) {
          copyPromptZB.classList.add('disabled');
        }

        // Get the language selected by the user
        ai_lang = localStorage.getItem('ai_lang') || 'input';

        // Clear previous response
        if (responseAreaPre) {
          responseAreaPre.innerHTML = '';
        }

        try {
          // Send request to API
          const response = await fetch('https://api.plz-ai.me/v1/gp', {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain',
            },
            body: JSON.stringify(body),
          });

          // Check for error response
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`API Error (${response.status}): ${errorText}`);
            throw new Error(`Network response error: ${response.status}`);
          }

          // Scroll to step 2
          window.location.hash = '#step2';

          // Set the appropriate font family based on language
          if (responseAreaPre) {
            if (ai_lang && ai_lang !== 'arabic' && ai_lang !== 'input') {
              responseAreaPre.style.fontFamily = 'TildaSans';
            } else {
              responseAreaPre.style.fontFamily = 'Cairo';
            }
          }

          // Process streaming response
          const reader = response.body.getReader();
          const decoder = new TextDecoder();

          // Stream processing function
          const processStream = async ({ done, value }) => {
            if (done) {
              console.log('Stream complete');

              // Re-enable UI elements
              if (copyPromptZB) {
                copyPromptZB.classList.remove('disabled');
              }

              if (enhanceBtn && enhanceBtnAtom) {
                enhanceBtn.classList.remove('disabled');
                enhanceBtnAtom.innerHTML = 'ظبط الكلام';
                enhanceBtnAtom.classList.remove('progress');
              }

              // Clean up URL hash
              history.replaceState(null, '', window.location.pathname + window.location.search);
              return;
            }

            // Decode the chunk
            const chunk = decoder.decode(value, { stream: true });

            // Append the chunk to the <pre> element
            if (responseAreaPre) {
              responseAreaPre.textContent += chunk;
            }

            // Read the next chunk
            return reader.read().then(processStream);
          };

          // Start processing the stream
          await reader.read().then(processStream);

        } catch (error) {
          // Scroll to step 2 even if there's an error
          window.location.hash = '#step2';
          setTimeout(() => {
            history.replaceState(null, '', window.location.pathname + window.location.search);
          }, 100);

          // Show appropriate error message based on language setting
          if (responseAreaPre) {
            // Generate meaningful error messages based on the type of error
            let errorMessage;
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
              errorMessage = ai_lang !== 'arabic' && ai_lang !== 'input' ?
                "Network connection error. Please check your internet connection." :
                "في مشكلة في الاتصال بالإنترنت. تأكد من اتصالك بالإنترنت.";
            } else {
              errorMessage = ai_lang !== 'arabic' && ai_lang !== 'input' ?
                `Sorry, ERROR.\nDon't worry, just try again later!` :
                `للأسف فيه مشكلة بسيطة.\nما تزعلش وحاول تاني بعد شوية.`;
            }

            responseAreaPre.innerHTML = errorMessage;
          }

          // Reset UI
          if (enhanceBtn) {
            enhanceBtn.classList.remove('disabled');
            if (enhanceBtnAtom) {
              enhanceBtnAtom.innerHTML = 'ظبط الكلام';
              enhanceBtnAtom.classList.remove('progress');
            }
          }

          console.error('API request failed:', error);
        }
      }

      /**
       * Copy the enhanced prompt to the clipboard
       * @param {HTMLElement} e - The button element that was clicked
       */
      function copyPrompt(e) {
        if (!responseAreaPre) return;

        let txt = e.querySelector('.tn-atom');
        if (!txt) return;

        let startText = txt.innerText;
        let textToCopy = responseAreaPre.textContent;

        navigator.clipboard.writeText(textToCopy)
          .then(() => {
            // Show success message
            txt.innerText = 'تمام, أخدنا الكوبي';
            console.log('Prompt copied to clipboard');
            // Restore original text after 3 seconds
            setTimeout(() => {
              txt.innerText = startText;
            }, 3000);
          })
          .catch((error) => {
            console.error('Error copying to clipboard:', error);
          });
      }

      /**
       * Set up the language change event handler
       * @param {HTMLSelectElement} languageSelector - The select element for language
       */
      function setupLanguageChangeHandler(languageSelector) {
        if (!languageSelector) return;

        // Define the change event listener
        changeEventListener = function (event) {
          if (responseAreaPre) {
            responseAreaPre.innerHTML = '';
          }

          if (copyPromptZB) {
            copyPromptZB.classList.add('disabled');
          }

          // Get the selected option value
          const selectedLanguage = event.target.value;
          console.log('Selected Language:', selectedLanguage);

          // Handle language selection
          if (selectedLanguage) {
            // Save the short code to local storage
            localStorage.setItem('ai_lang', languageMap[selectedLanguage]);
          } else {
            localStorage.setItem('ai_lang', 'input');
          }

          // Get the language selected by the user
          ai_lang = localStorage.getItem('ai_lang') || 'input';

          // Update the body object with language
          body.ai_lang = ai_lang;

          // Apply appropriate text direction and font based on language
          if (responseAreaPreContainer && responseAreaPreTextwrapper) {
            if (ai_lang !== 'arabic' && ai_lang !== 'input') {
              // Set text alignment to left for non-Arabic languages
              responseAreaPreContainer.style.textAlign = 'left';
              responseAreaPreTextwrapper.style.direction = 'ltr';
              responseAreaPreTextwrapper.style.fontFamily = 'TildaSans';
            } else {
              // Set text alignment to right for Arabic
              responseAreaPreContainer.style.textAlign = '';
              responseAreaPreTextwrapper.style.direction = '';
              responseAreaPreTextwrapper.style.fontFamily = 'Cairo';
            }
          }
        };

        // Apply styles and add the listener
        languageSelector.style.backgroundColor = 'black';
        languageSelector.removeEventListener('change', changeEventListener); // Prevent duplicates
        languageSelector.addEventListener('change', changeEventListener);

        // Set flag to prevent adding duplicate listeners
        hasAddedListener = true;
      }

      /**
       * Clean up the language change event handler
       * @param {HTMLElement} element - The element containing the language selector
       */
      function cleanupLanguageChangeHandler(element) {
        if (!element) return;

        const languageSelector = element.querySelector('select.t-select[name="res_lang"]');

        if (languageSelector && changeEventListener) {
          languageSelector.removeEventListener('change', changeEventListener);
          languageSelector.style.backgroundColor = 'red';
          hasAddedListener = false;
        }
      }

      /**
       * Detect the user's country and hide certain elements for non-Russian users
       * Uses the Tilda geo API to get country information
       */
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://geo.tildacdn.com/geo/country/', true);
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 400) {
          var data = xhr.responseText;
          if (data !== 'RU') {
            var toHide = document.querySelectorAll('.uc-blocked');
            Array.prototype.forEach.call(toHide, function (el) {
              el.style.display = 'none';
            });
          }
        }
      };
      xhr.send();
    });
  });

});