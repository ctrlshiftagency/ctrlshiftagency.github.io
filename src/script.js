







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




      // Include prompt only if it is not empty
      if (prompt.value.trim() !== '') {
        enhanceBtn.querySelector('.tn-atom').style.display = 'none';
        body.prompt = prompt.value.trim();
      }

      // Add an event listener for the 'input' event
      prompt.addEventListener('input', function () {
        // Check if the input has a value
        if (prompt.value.trim() !== '') {
          // Include the prompt in the body object
          body.prompt = prompt.value.trim();
          // Show the button
          // Enable the div by removing the 'disabled' class
          enhanceBtn.classList.remove('disabled');
        } else {

          // Disable the div by adding the 'disabled' class
          enhanceBtn.classList.add('disabled');
        }
      });
      /**
       * Enhance the prompt using the Plz AI API
       * Hint: Using stream processing to display the response text in real-time
       */
      enhanceBtn.addEventListener('click', async () => {
        if (!enhanceBtn.classList.contains('disabled')) {
          //hide .uc-copy-prompt and .uc-step_title2 before the response is received

          // step2Title.classList.add('hide');
          // copyPromptZB.classList.add('hide');
          copyPromptZB.classList.add('disabled');
          // responseAreaZB.classList.add('hide');

          // const prompt = document.querySelector('textarea[name="origPrompt"]').value.trim();
          //   const enhancedPrompt = document.querySelector('.pxb-enhanced-prompt .tn-atom');
          // const enhancedPrompt = document.querySelector('.uc-res .t-text');

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
              if (done) {
                console.log('Stream complete');
                //show the copy button
                // copyPromptZB.classList.remove('hide');
                copyPromptZB.classList.remove('disabled');
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
            txt.innerText = 'Copied - All Done'
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
    });
  })
})
