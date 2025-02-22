







document.addEventListener("DOMContentLoaded", () => {
  /** 
 * Function to update the zoom level of a given element based on the window width
 * @param {HTMLElement} element - The element to update
*/
  const updateZoom = (element) => {
    const windowWidth = window.innerWidth;

    if (windowWidth >= 1200) {
      element.style.zoom = ((windowWidth - 1200) / 720) * 0.5 + 1;
    }
  };

  /** Universal function to select elements by ID or class name
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
   */
  t_onReady(function () {
    t_onFuncLoad('t396_init', function () {
      // Construct the body object
      const body = {}
      const prompt = document.querySelector('textarea[name="origPrompt"]')
      const charCount = document.querySelector('.pxb-char-count');
      charCount.querySelector('.tn-atom').classList.add('gc');

      // const errorMessage = document.getElementById('errorMessage');

      const enhanceBtn = document.querySelector('.pxb-enhance');
      const step2Title = document.querySelector('.uc-step_title2');
      // Get the response area element
      const responseAreaZB = document.querySelector('.uc-res');
      const responseAreaPreContainer = responseAreaZB.querySelector('.t004 .t-container');
      const responseAreaPreTextwrapper = responseAreaPreContainer.querySelector('.t-text')
      // Initialize <pre> tag
      responseAreaPreTextwrapper.innerHTML = '<pre class="pxb-response" style="height:auto;"></pre>';
      const responseAreaPre = responseAreaZB.querySelector('.pxb-response');

      const copyPromptZB = document.querySelector('.uc-copy-prompt');
      const copyPromptBtn = copyPromptZB.querySelector('.pxb-copy-prompt');

      // Disable and hide
      enhanceBtn.classList.add('disabled');

      // step2Title.classList.add('hide');
      // responseAreaZB.classList.add('hide');
      // copyPromptZB.classList.add('hide');
      copyPromptZB.classList.add('disabled');

      // Set the default language to 'input' when the page loads
      localStorage.setItem('ai_lang', 'input')
      let ai_lang = localStorage.getItem('ai_lang') || 'input';

      //always include ai_lang in the body object
      body.ai_lang = localStorage.getItem('ai_lang') || 'input';

      // Get and Set the reply language

      // Get the select element
      const languageSelectElement = document.querySelector('select.t-select[name="res_lang"]');

      // Map Arabic language names to their short codes
      const languageMap = {
        "العربية": "arabic",
        "الإنجليزية": "english",
        "الالمانية": "german",
        "الإسبانية": "spanish",
        "الفرنسية": "french",
        "الروسية": "russian",
      };


      // Add an event listener for the 'change' event
      languageSelectElement.addEventListener('change', function (event) {


        responseAreaPre.innerHTML = '';
        copyPromptZB.classList.add('disabled');

        // copyPromptBtn.style.display = 'none';
        // step2Title.style.display = 'none';
        // Hide the response area if exists
        // if (responseAreaPre) responseAreaPre.style.display = 'none';

        // Get the selected option value (Arabic language name)
        const selectedLanguage = event.target.value;

        // Get the corresponding short code from the languageMap
        if (selectedLanguage) {
          // Save the short code to local storage
          localStorage.setItem('ai_lang', languageMap[selectedLanguage]);

          // Optional: Log the selected language and short code to the console
          console.log('Selected Language:', selectedLanguage);
        } else {
          localStorage.setItem('ai_lang', 'input')
        }

        // Get the language selected by the user from local storage
        ai_lang = localStorage.getItem('ai_lang') || 'input';

        //include ai_lang in the body object
        body.ai_lang = ai_lang;

        // Check if the selected language is NOT Arabic or input
        if (ai_lang !== 'arabic' && ai_lang !== 'input') {
          // Set text alignment to left
          responseAreaPreContainer.style.textAlign = 'left';
          responseAreaPreTextwrapper.style.direction = 'ltr'
          responseAreaPreTextwrapper.style.fontFamily = 'TildaSans';
        } else {
          // Set text alignment to right
          responseAreaPreContainer.style.textAlign = '';
          responseAreaPreTextwrapper.style.direction = ''
          responseAreaPreTextwrapper.style.fontFamily = 'Cairo';
        }
      });















      // document.querySelector('.pxb-enhance').addEventListener('click', async () => {
      //   const prompt = document.querySelector('textarea[name="origPrompt"]').value;
      //   try {
      //     const response = await fetch('https://api.plz-ai.me/v1/gp', {
      //       method: 'POST',
      //       headers: {
      //         'Content-Type': 'text/plain',
      //       },
      //       body: JSON.stringify({
      //         prompt: prompt
      //       }),
      //     });

      //     if (!response.ok) {
      //       throw new Error('Network response was not ok');
      //     }

      //     const responseText = await response.text();

      //     // Assuming you have an element with ID "targetElement"
      // const enhancedPrompt =  document.querySelector('.pxb-enhanced-prompt .tn-atom');


      // // Replace line breaks with <br> tags and preserve spaces
      // const formattedText = responseText.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');

      // // Update the element's content
      // // enhancedPrompt.innerHTML = formattedText;
      // enhancedPrompt.innerHTML = `<pre class="pxb-response">${await response.text()}</pre>`;


      //     // document.querySelector('.pxb-enhanced-prompt .tn-atom').textContent = textResponse;
      //   } catch (error) {
      //     console.error('There has been a problem with your fetch operation:', error);
      //   }
      // });

      /**
       * Enhance the prompt using the Plz AI API
       * Hint: not using thre real-time stream processing
       */
      // document.querySelector('.pxb-enhance').addEventListener('click', async () => {
      //   const prompt = document.querySelector('textarea[name="origPrompt"]').value;
      //   const enhancedPrompt = document.querySelector('.pxb-enhanced-prompt .tn-atom');

      //   try {
      //     const response = await fetch('https://api.plz-ai.me/v1/gp', {
      //       method: 'POST',
      //       headers: {
      //         'Content-Type': 'text/plain',
      //       },
      //       body: JSON.stringify({
      //         prompt: prompt
      //       }),
      //     });

      //     if (!response.ok) {
      //       throw new Error('Network response was not ok');
      //     }

      //     // Clear previous content
      //     enhancedPrompt.innerHTML = '';

      //     // Get the readable stream from the response body
      //     const reader = response.body.getReader();
      //     const decoder = new TextDecoder();

      //     // Function to process each chunk of the stream
      //     const processStream = async ({ done, value }) => {
      //       if (done) {
      //         console.log('Stream complete');
      //         return;
      //       }

      //       // Decode the chunk
      //       const chunk = decoder.decode(value, { stream: true });

      //       // Replace line breaks with <br> and spaces with &nbsp;
      //       const formattedChunk = chunk
      //         .replace(/\n/g, '<br>')
      //         .replace(/ /g, '&nbsp;');

      //       // Append the formatted chunk to the element
      //       enhancedPrompt.innerHTML += formattedChunk;

      //       // Read the next chunk
      //       return reader.read().then(processStream);
      //     };

      //     // Start processing the stream
      //     await reader.read().then(processStream);
      //   } catch (error) {
      //     console.error('There has been a problem with your fetch operation:', error);
      //   }
      // });



      const maxLength = 500;

      //initialize body.pompt if not empty
      // Include prompt only if it is not empty
      if (prompt.value.trim() !== '' && prompt.value.trim().length <= maxLength) {
        // enhanceBtn.querySelector('.tn-atom').style.display = 'none';
        body.prompt = prompt.value.trim();
      }

      // Add an event listener for the 'input' event
      prompt.addEventListener('input', function () {
        let inputValue = prompt.value.trim(); // Trim whitespace

        // Check if the input has a value and enable or disable the BTN
        if (inputValue !== '') {
          // Enable the div by removing the 'disabled' class
          enhanceBtn.classList.remove('disabled');
        } else {
          // Disable the BTN by adding the 'disabled' class
          enhanceBtn.classList.add('disabled');
        }

        // Truncate the input if it exceeds the maximum length
        if (inputValue.length > maxLength) {
          inputValue = inputValue.substring(0, maxLength).trim(); // Trim to max length
          prompt.value = inputValue; // Update the textarea value
        }

        // Update the character count
        charCount.querySelector('.tn-atom').innerHTML = `${inputValue.length} / ${maxLength}`;

        // Optional: Add visual feedback when the limit is reached
        if (inputValue.length >= maxLength) {
          charCount.querySelector('.tn-atom').classList.remove('gc');
          charCount.querySelector('.tn-atom').classList.add('ec');
        } else {
          charCount.querySelector('.tn-atom').classList.remove('ec');
          charCount.querySelector('.tn-atom').classList.add('gc');
        }
      });
      /**
       * Enhance the prompt using the Plz AI API
       * Hint: Using stream processing to display the response text in real-time
       */
      enhanceBtn.addEventListener('click', async () => {
        if (!enhanceBtn.classList.contains('disabled')) {
          let inputValue = prompt.value.trim(); // Trim whitespace

          // Validate the length
          if (inputValue.length > maxLength) {
            // errorMessage.style.display = 'block'; // Show error message
            return; // Stop further execution
          }

          // errorMessage.style.display = 'none'; // Hide error message
          body.prompt = inputValue; // Include prompt only if it is not empty and don't exceed the max length

          enhanceBtn.classList.add('disabled');
          enhanceBtn.querySelector('.tn-atom').classList.add('progress')
          enhanceBtn.querySelector('.tn-atom').innerHTML = 'ثواني ...';
          // enhanceBtn.querySelector('.tn-atom').innerHTML = 'ثواني... <div class="loading-spinner"></div>';


          //hide .uc-copy-prompt and .uc-step_title2 before the response is received

          copyPromptZB.classList.add('disabled');


          // Get the language selected by the user
          ai_lang = localStorage.getItem('ai_lang') || 'input';
          // Initialize <pre> tag
          // responseAreaPreTextwrapper.innerHTML = '<pre class="pxb-response"></pre>';
          responseAreaPre.innerHTML = '';
          try {
            const response = await fetch('https://api.plz-ai.me/v1/gp', {
              method: 'POST',
              headers: {
                'Content-Type': 'text/plain',
              },
              body: JSON.stringify(body),
            });

            if (!response.ok) {
              throw new Error('Network response was not ok');
            }

            window.location.hash = '#step2';

            //show .uc-copy-prompt and .uc-step_title2 after the response is received
            // step2Title.classList.remove('hide');
            // responseAreaZB.classList.remove('hide');
            // responseAreaPre.style.display = 'block';


            // Clear previous content
            // responseAreaPreTextwrapper.innerHTML = '<pre class="pxb-response"></pre>'; // Initialize <pre> tag

            // Check if the selected language is NOT Arabic or input to set the font-family
            if (ai_lang && ai_lang !== 'arabic' && ai_lang !== 'input') {
              // Set font-family to TildaSans for left alignment
              responseAreaPre.style.fontFamily = 'TildaSans';
            } else {
              responseAreaPre.style.fontFamily = 'Cairo';
            }

            // Get the readable stream from the response body
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            // Function to process each chunk of the stream
            const processStream = async ({ done, value }) => {
              const targetElement = document.getElementById('step2');
              if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' }); // Smooth scrolling
              }
              if (done) {
                console.log('Stream complete');
                //show the copy button
                // copyPromptZB.classList.remove('hide');
                copyPromptZB.classList.remove('disabled');
                enhanceBtn.classList.remove('disabled');
                enhanceBtn.querySelector('.tn-atom').innerHTML = 'ظبط الكلام';
                enhanceBtn.querySelector('.tn-atom').classList.remove('progress')
                history.replaceState(null, '', window.location.pathname + window.location.search);
                return;
              }

              // Decode the chunk
              const chunk = decoder.decode(value, { stream: true });

              // Append the chunk to the <pre> element
              responseAreaPre.textContent += chunk;

              // Read the next chunk
              return reader.read().then(processStream);
            };

            // Start processing the stream
            await reader.read().then(processStream);
          } catch (error) {
            window.location.hash = '#step2';
            setTimeout(() => {
              history.replaceState(null, '', window.location.pathname + window.location.search);
            }, 100); // Small delay to ensure smooth scrolling finishes

            if (ai_lang !== 'arabic' && ai_lang !== 'input') {
              responseAreaPre.innerHTML = `Sorry, ERROR.\nDon’t worry, just try again later!`
            } else {
              responseAreaPre.innerHTML = `للأسف فيه مشكلة بسيطة.\nما تزعلش وحاول تاني بعد شوية.`
            }
            enhanceBtn.classList.remove('disabled');
            enhanceBtn.querySelector('.tn-atom').innerHTML = 'ظبط الكلام';
            console.error('There has been a problem with your fetch operation:', error);
          }
        }
      });

      /**
       * Copy the enhanced prompt to the clipboard
       */
      function copyPrompt(e) {
        let txt = e.querySelector('.tn-atom')
        let startText = txt.innerText
        let textToCopy = responseAreaPre.textContent
        navigator.clipboard.writeText(textToCopy)
          .then(() => {
            txt.innerText = 'تمام, أخدنا الكوبي'
            console.log('Prompt copied to clipboard');
            setTimeout(() => {
              txt.innerText = startText;
            }, 3000);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }

      /**
       * Copy the enhanced prompt to the clipboard
       */
      copyPromptBtn.addEventListener('click', function () {
        copyPrompt(this);
      })

      //Hint: using the following code to add the onclick event to the element after 5 seconds
      // document.querySelectorAll(".pxb-copy-prompt").forEach(function (element) {
      //   setTimeout(() => {
      //     element.setAttribute("onclick", "copyPrompt(this)");
      //   }, 5000);
      // })


      // detect the country and hide the element
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
  })
})
