if(!window.isCordovaApp) {
  try {
    var app = require('electron').remote.app;
    var packageInfo = require('electron').remote.require('./package.json');

    window.cordova.getAppVersion = {
      getAppName: function(success, fail) {
        success(app.getName());
      },
      getPackageName: function(success, fail) {
        success(packageInfo.name);
      },
      getVersionCode: function(success, fail) {
        success(app.getVersion());
      },
      getVersionNumber: function(success, fail) {
        success(app.getVersion());
      }
    };
  } catch(e) {
    console.error('Failed to initialize App Version shim, unknown error: ', e);
  }
}