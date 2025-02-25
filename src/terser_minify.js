// Import Terser so we can use it
import { minify } from 'terser';

// Import fs so we can read/write files
import { readFileSync, writeFileSync } from 'fs';

// Define the config for how Terser should minify the code
// This is set to how you currently have this web tool configured
const config = {
  compress: {
    dead_code: true, // Remove unreachable code from the script
    drop_console: true, // Remove calls to console.* from the script
    drop_debugger: false, // Remove calls to debugger from the script
    keep_classnames: false, // Preserve unused classes in the script
    keep_fargs: true, // Preserve unused arguments within functions
    keep_fnames: false, // Preserve unused functions in the script
    keep_infinity: false // Preserve `Infinity` usage, instead of replacing it with `1/0`
  },
  mangle: {
    eval: false, // Mangle variable names within `eval` scopes
    keep_classnames: false, // Enable to preserve class names and not mangle them 
    keep_fnames: false, // Enable to preserve function names and not mangle them
    toplevel: false, // Enable to mangle names within the top-level scope
    safari10: false // Enable to work around a Safari 10 iterator bug
  },
  module: false, // Enable if you are minifying an ES6 module
  sourceMap: false, // dist.min.js Provide a filename for your output script to enable source map generation
  output: {
    comments: false //false: Remove all comments, some: Preserve JSDoc @preserve and @license comments, true: Keep all comments
  },
  nameCache: {}
};



const filesToMinify = ['script', 'script_using_class', 'Observe']

filesToMinify.forEach(async (file) => {
  // Load in your code to minify
  const code = readFileSync(`src/${file}.js`, 'utf8');

  // Minify the code with Terser
  const minified = await minify(code, config);

  // Save the code!
  writeFileSync(`src/min/${file}.min.js`, minified.code);
})