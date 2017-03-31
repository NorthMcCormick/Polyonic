const fs = require('fs-extra');

var config = fs.readJsonSync(__dirname + '/polyonic.config.json');

// Do some cool config normalizing or something here

function checkNested(obj /*, level1, level2, ... levelN*/) {
  var args = Array.prototype.slice.call(arguments, 1);

  for (var i = 0; i < args.length; i++) {
    if (!obj || !obj.hasOwnProperty(args[i])) {
      return false;
    }
    obj = obj[args[i]];
  }
  return true;
}

//
// WINDOWS 
//

if(!checkNested(config, 'windows')) {
  config.windows = {};
}

// DEFAULT WINDOW

if(!checkNested(config, 'windows', 'default')) {
  config.windows.default = {};
}

if(!checkNested(config, 'windows', 'default', 'width')) {
  config.windows.default.width = 1200;
}

if(!checkNested(config, 'windows', 'default', 'height')) {
  config.windows.default.height = 900;
}

if(!checkNested(config, 'windows', 'default', 'fullscreen')) {
  config.windows.default.fullscreen = false;
}

if(!checkNested(config, 'windows', 'default', 'resizeable')) {
  config.windows.default.resizeable = true;
}

//
// DEBUG 
//

if(!checkNested(config, 'debug')) {
  config.debug = {};
}

if(!checkNested(config, 'debug', 'devTools')) {
  config.debug.devTools = false;
}

//
// PLATFORM 
//

if(!checkNested(config, 'platform')) {
  config.platform = {};
}

if(!checkNested(config, 'platform', 'asar')) {
  config.platform.asar = true;
}

if(!checkNested(config, 'platform', 'macos')) {
  config.platform.macos = {};
}

if(!checkNested(config, 'platform', 'macos', 'autoClose')) {
  config.platform.macos.autoClose = false;
}

module.exports = config;