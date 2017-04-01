if(!window.isCordovaApp) {
  try {
    var clipboard = require('electron').clipboard;

    window.cordova.plugins.clipboard = {
      copy: function(text, success, fail) {
        clipboard.writeText(text); 
        success(text);
      },
      paste: function(success, fail) {
        success(clipboard.readText());
      }
    }
  } catch(e) {
    console.error('Failed to initialize Clipboard shim, unknown error: ', e);
  }
}