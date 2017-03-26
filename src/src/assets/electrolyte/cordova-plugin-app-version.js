if(!window.isCordovaApp) {
  try {
    var app = require('electron').remote.app;
    var fs = require('fs');
    //var packageInfo = require(process.cwd() + '/package.json');

    window.cordova.getAppVersion = {
      getAppName: function(success, fail) {

        //var xml = fs.readFileSync(process.cwd() + '/config.xml');
        
        success(app.getName());
      },
      getPackageName: function(success, fail) {
        success(app.getName());
      },
      getVersionCode: function(success, fail) {
        success(null);
      },
      getVersionNumber: function(success, fail) {
        success(app.getVersion());
      }
    };
  } catch(e) {
    console.error('Failed to initialize App Version shim, unknown error: ', e);
  }
}