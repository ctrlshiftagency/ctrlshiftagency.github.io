







document.addEventListener("DOMContentLoaded", () => {

  // Set the default language to 'input' when the page loads
  localStorage.setItem('ai_lang', 'input')
  // Get the selected language from local storage
  const selectedLanguage = localStorage.getItem('ai_lang');

  // Check if the selected language is NOT Arabic or input
  if (selectedLanguage !== 'arabic' && selectedLanguage !== 'input') {
    // Set text alignment to left
    document.querySelector('.uc-res .t004 .t-container').style.textAlign = 'left';
  } else {
    // Set text alignment to right
    document.querySelector('.uc-res .t004 .t-container').style.textAlign = 'right';
  }

  // Get and Set the reply language
  t_onReady(function () {
    t_onFuncLoad('t396_init', function () {
      // Get the select element
      const selectElement = document.querySelector('select.t-select[name="res_lang"]');

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
      selectElement.addEventListener('change', function (event) {
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
      });
    })
  })


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

  /**
   * Enhance the prompt using the Plz AI API
   * Hint: Using stream processing to display the response text in real-time
   */
  document.querySelector('.pxb-enhance').addEventListener('click', async () => {
    //hide .uc-copy-prompt and .uc-step_title2 before the response is received
    document.querySelector('.uc-copy-prompt').style.display = 'none';
    document.querySelector('.uc-step_title2').style.display = 'none';
    document.querySelector('.uc-res').style.display = 'none';

    const prompt = document.querySelector('textarea[name="origPrompt"]').value;
    //   const enhancedPrompt = document.querySelector('.pxb-enhanced-prompt .tn-atom');
    const enhancedPrompt = document.querySelector('.uc-res .t-text');

    // Get the language selected by the user
    const ai_lang = localStorage.getItem('ai_lang') || 'input';
    try {
      const response = await fetch('https://api.plz-ai.me/v1/gp', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          prompt,
          ai_lang: ai_lang
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      //show .uc-copy-prompt and .uc-step_title2 after the response is received
      document.querySelector('.uc-step_title2').style.display = 'block';
      document.querySelector('.uc-res').style.display = 'block';


      // Clear previous content
      enhancedPrompt.innerHTML = '<pre class="pxb-response"></pre>'; // Initialize <pre> tag
      const preElement = enhancedPrompt.querySelector('.pxb-response');

      // Get the readable stream from the response body
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // Function to process each chunk of the stream
      const processStream = async ({ done, value }) => {
        if (done) {
          console.log('Stream complete');
          //show the copy button
          document.querySelector('.uc-copy-prompt').style.display = 'block';
          return;
        }

        // Decode the chunk
        const chunk = decoder.decode(value, { stream: true });

        // Append the chunk to the <pre> element
        preElement.textContent += chunk;

        // Read the next chunk
        return reader.read().then(processStream);
      };

      // Start processing the stream
      await reader.read().then(processStream);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  });

  /**
   * Copy the enhanced prompt to the clipboard
   */
  function copyPrompt(e) {
    let txt = e.querySelector('.tn-atom')
    let startText = txt.innerText
    let textToCopy = document.querySelector('.uc-res .t-text .pxb-response').textContent
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
  document.querySelector('.pxb-copy-prompt').addEventListener('click', function () {
    copyPrompt(this);
  })

  //Hint: using the following code to add the onclick event to the element after 5 seconds
  // document.querySelectorAll(".pxb-copy-prompt").forEach(function (element) {
  //   setTimeout(() => {
  //     element.setAttribute("onclick", "copyPrompt(this)");
  //   }, 5000);
  // })
});

