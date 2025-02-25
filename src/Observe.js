/**
   * Observer Class Definition
   * A class that uses MutationObserver to monitor DOM elements and react to their changes
   * This helps us handle elements that might not be immediately available in the DOM
   */
class Observer {
  /**
   * @param {String} targetArgument - The target selector to observe (e.g., ".element" or "#element")
   * @param {Object} [options={}] - Configuration options
   * @param {Boolean} [options.async=false] - Set to true if callbacks should be executed asynchronously
   * @param {Boolean} [options.trackReferences=false] - Set to true to keep element references for onRemoved callback
   * @param {Number} [options.debounce=0] - Debounce time in milliseconds to prevent multiple rapid callbacks
   */
  constructor(targetArgument, options = {}) {
    this.targetSelector = targetArgument;
    this.isAsync = options.async || false;
    this.trackReferences = options.trackReferences || false;
    this.debounceTime = options.debounce || 0; // Debounce time in ms
    this.observer = null;
    this.listeners = [];
    this.debounceTimers = {};
    this.initialize();
  }

  /**
   * Initialize the MutationObserver and start observing the document
   * @private
   */
  initialize() {
    // Configure the MutationObserver
    this.observer = new MutationObserver(() => this.checkAllListeners());

    // Options for the observer
    const config = {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['class', 'id']
    };

    // Start observing the document body
    this.observer.observe(document.body, config);

    // Check if elements already exist
    this.checkAllListeners();
  }

  /**
   * Check all registered listeners against the current DOM state
   * Uses debouncing to prevent excessive processing during rapid DOM changes
   * @private
   */
  checkAllListeners() {
    // Use a unique key to debounce calls
    const debounceKey = 'checkAll';

    // Clear any existing timer
    if (this.debounceTimers[debounceKey]) {
      clearTimeout(this.debounceTimers[debounceKey]);
    }

    // Set a new timer if debounce is enabled
    if (this.debounceTime > 0) {
      this.debounceTimers[debounceKey] = setTimeout(() => {
        for (const listener of this.listeners) {
          this.checkListener(listener);
        }
        delete this.debounceTimers[debounceKey];
      }, this.debounceTime);
    } else {
      // Otherwise run immediately
      for (const listener of this.listeners) {
        this.checkListener(listener);
      }
    }
  }

  /**
   * Check a specific listener against the current DOM state
   * Handles state changes and executes appropriate callbacks
   * @param {Object} listener - The listener object to check
   * @private
   */
  checkListener(listener) {
    const { selector, callbacks } = listener;
    const elements = document.querySelectorAll(selector);
    const exists = elements.length > 0;

    // Check if state changed
    const stateChanged = listener.exists !== exists;

    // Skip if no state change and not the first check
    if (!stateChanged && listener.exists !== null && !listener.forceCallback) {
      return;
    }

    // Store element references if tracking is enabled and elements exist
    if (this.trackReferences && exists) {
      listener.elementReferences = Array.from(elements);
    }

    // Get references before updating existence state
    const prevReferences = listener.elementReferences || [];

    // Update the state
    listener.exists = exists;

    // Reset the force flag
    listener.forceCallback = false;

    // Call appropriate callbacks
    if (exists && callbacks.onFound) {
      // Only call onFound once when the element is first found
      if (stateChanged || listener.pendingFound) {
        listener.pendingFound = false;
        this.executeCallback(callbacks.onFound, [elements]);
      }
    } else if (!exists && callbacks.onRemoved) {
      // Only call onRemoved once when the element is first removed
      if (stateChanged) {
        this.executeCallback(callbacks.onRemoved, [prevReferences]);
      }
    }

    // Handle state changes
    if (stateChanged && callbacks.onChanged) {
      this.executeCallback(callbacks.onChanged, [exists ? elements : prevReferences, exists]);
    }

    // Clear references if element no longer exists and we don't need to keep them
    if (!exists && !this.trackReferences) {
      listener.elementReferences = null;
    }
  }

  /**
   * Execute a callback function with provided arguments
   * Supports async execution if configured
   * @param {Function} callback - The callback function to execute
   * @param {Array} args - Arguments to pass to the callback
   * @private
   */
  executeCallback(callback, args) {
    if (typeof callback !== 'function') return;

    if (this.isAsync) {
      setTimeout(() => callback(...args), 0);
    } else {
      callback(...args);
    }
  }

  /**
   * Add a new listener for a specific selector
   * @param {String} selector - The CSS selector to listen for
   * @param {Function|Object} callbacks - Callback function or object with onFound, onRemoved, onChanged callbacks
   * @returns {Observer} - Returns this instance for method chaining
   */
  addListener(selector, callbacks) {
    // Normalize callbacks
    const normalizedCallbacks = typeof callbacks === 'function'
      ? { onFound: callbacks }
      : callbacks || {};

    // Check if we already have a listener for this selector
    const existingListener = this.listeners.find(l => l.selector === selector);

    if (existingListener) {
      // Update callbacks for existing listener
      existingListener.callbacks = normalizedCallbacks;
      // Force a callback run
      existingListener.forceCallback = true;
      // Check immediately
      this.checkListener(existingListener);
      return this;
    }

    // Create listener object
    const listener = {
      selector,
      callbacks: normalizedCallbacks,
      exists: null,  // Will be set on first check
      elementReferences: null,  // Will store references if tracking is enabled
      pendingFound: true,  // Flag to ensure onFound is called at least once
      forceCallback: false  // Flag to force callback execution
    };

    // Add to listeners array
    this.listeners.push(listener);

    // Check immediately
    this.checkListener(listener);

    return this;
  }

  /**
   * Start listening to a specific class name
   * @param {String} className - The HTML class name to listen for
   * @param {Function|Object} callback - Callback function or object with callbacks
   * @returns {Observer} - Returns this instance for method chaining
   */
  listenToClass(className, callback) {
    // Ensure className starts with a dot
    const normalizedClassName = className.startsWith('.') ? className : `.${className}`;

    // Create the correct selector based on the target selector
    let fullSelector;
    if (this.targetSelector.includes(' ')) {
      // If the target selector has spaces, it's a complex selector
      // In this case, we need to add the class to the last part
      const parts = this.targetSelector.split(' ');
      parts[parts.length - 1] += normalizedClassName;
      fullSelector = parts.join(' ');
    } else if (this.targetSelector.includes('.')) {
      // If the target selector already has a class, we need to join them
      fullSelector = this.targetSelector + normalizedClassName;
    } else {
      // Simple case: just append the class
      fullSelector = this.targetSelector + normalizedClassName;
    }

    return this.addListener(fullSelector, callback);
  }

  /**
   * Start listening to a specific ID
   * @param {String} id - The HTML ID to listen for
   * @param {Function|Object} callback - Callback function or object with callbacks
   * @returns {Observer} - Returns this instance for method chaining
   */
  listenToId(id, callback) {
    // Ensure id starts with a #
    const normalizedId = id.startsWith('#') ? id : `#${id}`;

    // Create the correct selector based on the target selector
    let fullSelector;
    if (this.targetSelector.includes(' ')) {
      // If the target selector has spaces, it's a complex selector
      // In this case, we need to add the ID to the last part
      const parts = this.targetSelector.split(' ');
      parts[parts.length - 1] += normalizedId;
      fullSelector = parts.join(' ');
    } else if (this.targetSelector.includes('#')) {
      // Can't have multiple IDs, so we'll warn and use the new one
      console.warn('Element already has an ID. Using the new ID instead.');
      fullSelector = this.targetSelector.replace(/#[^.\s]+/, '') + normalizedId;
    } else {
      // Simple case: just append the ID
      fullSelector = this.targetSelector + normalizedId;
    }

    return this.addListener(fullSelector, callback);
  }

  /**
   * Start listening to a specific element selector
   * @param {String} selector - The CSS selector to listen for
   * @param {String|Function|Object} parentSelector - Parent selector or callback or callback object
   * @param {Function|Object} [callback] - Callback function or object with callbacks
   * @returns {Observer} - Returns this instance for method chaining
   */
  listenToElement(selector, parentSelector, callback) {
    // Handle optional parentSelector parameter
    if (typeof parentSelector === 'function' || (parentSelector && typeof parentSelector === 'object' && !Array.isArray(parentSelector))) {
      callback = parentSelector;
      parentSelector = null;
    }

    let fullSelector;
    if (parentSelector) {
      fullSelector = `${parentSelector} ${selector}`;
    } else {
      fullSelector = selector;
    }

    return this.addListener(fullSelector, callback);
  }

  /**
   * Stop observing DOM mutations and clear all listeners
   */
  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.listeners = [];
  }
}
