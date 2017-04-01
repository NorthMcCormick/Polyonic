'use strict'

const Q                   = require('q');
const gulp                = require('gulp');
const watch               = require('gulp-watch');
const batch               = require('gulp-batch');
const jetpack             = require('fs-jetpack');
const runSequence         = require('run-sequence');
const packager            = require('electron-packager');
const parseString         = require('xml2js').parseString;
const utils               = require('../utils');
const exec                = require('child_process').exec;
const argv                = require('yargs').argv;

// -------------------------------------
// Configure paths
// -------------------------------------

const projectDir = jetpack;
const srcDir = projectDir.cwd('./src');
const destDir = projectDir.cwd('./build');

let paths = {
  copyFromAppDir: [
    './www/**',
    './routes/**',
    './**/*.+(jpg|png|svg)'
  ]
};

// -------------------------------------
// Tasks
// -------------------------------------

gulp.task('validate', function() {
  console.log('Validating that the setup is correct and that the build tools are not broken...');

  var isGood = true;

  try {
    var configXml = srcDir.read('./config.xml', 'utf8');

    if(!configXml) {
      throw 'Error: Could not find config.xml';
    }

  } catch(e) {
    console.log('Can not access/find/read your config.xml. Is your Ionic project in the /src directory?');
    console.error(e);

    isGood = false;
  }

  try {
    var config = require(srcDir.path('./polyonic.config.js'));

    /*if(!config) {
      throw 'Error: Could not find polyonic.config.js';
    }*/

  } catch(e) {
    console.log('Could not access/find/read your polyonic.config.js. Do the config and json file exist in your Ionic project? (hint: Did you run `gulp create` yet?)');
    console.error(e);
    
    isGood = false;
  }

  if(isGood) {
    console.log('Project checks out!');
  }else{
    console.log('Project has one or more issues.');
  }
})

gulp.task('clean', function (done) {
  destDir.dirAsync('.', { empty: true }).then(function() {
    return jetpack.remove('output');
  }).then(function() {
    done();
  });
});

gulp.task('copy', function (done) {
  projectDir.copyAsync('src', destDir.path(), {
    overwrite: true,
    matching: paths.copyFromAppDir
  }).then(function() {
    return projectDir.copyAsync(srcDir.path('./app.js'), destDir.path('./app.js'));
  }).then(function() {
    return projectDir.copyAsync(srcDir.path('./polyonic.config.js'), destDir.path('./polyonic.config.js'));
  }).then(function() {
    return projectDir.copyAsync(srcDir.path('./polyonic.config.json'), destDir.path('./polyonic.config.json'));
  }).then(function() {
    done();
  });
});

gulp.task('finalize', function (done) {
  var rootPackage = projectDir.read('package.json', 'json');
  var configXml = srcDir.read('./config.xml', 'utf8');
  let manifest = srcDir.read('package.json', 'json');

  parseString(configXml, function (err, result) {
    var appName = result.widget.name[0];
    
    // Add "dev" or "test" suffix to name, so Electron will write all data
    // like cookies and localStorage in separate places for each environment.
    // TODO
    /*switch (utils.getEnvName()) {
      case 'development':
        manifest.name += '-dev';
        manifest.productName = appName + ' Dev';
        break
      case 'test':
        manifest.name += '-test';
        manifest.productName = appName + ' Test';
        break
    }*/

    manifest.dependencies = rootPackage.dependencies; // Electron ONLY needs the deps for itself, the ionic app should be fully built by now
    manifest.devDependencies = {}; // Remove these so they don't get installed
    manifest.productName = appName;

    manifest.env = projectDir.read('config/env_' + utils.getEnvName() + '.json', 'json');

    destDir.write('package.json', manifest);

    done();
  });

});

gulp.task('installDeps', function(done) {
  exec('cd build && npm install', function(error, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    done(error);
  });
})

gulp.task('watch', function () {
  watch('src/**/*.js', batch(function (events, done) {
    gulp.start('bundle-watch', done)
  }));
  watch(paths.copyFromAppDir, { cwd: 'app' }, batch(function (events, done) {
    gulp.start('copy-watch', done)
  }));
});

gulp.task('build-electron', function(done) {
  var configXml = srcDir.read('./config.xml', 'utf8');
  var config              = require(srcDir.path('./polyonic.config.js'));

  parseString(configXml, function (err, result) {
    var appVersion = result.widget.$.version;

    var iconFile = null;
    var platform = argv.platform;

    if(platform === undefined) {
      platform = process.platform;
    }

    var buildForPlatform = platform;
    var platformConfig = {};

    function getMacOSConfig() {
      //platformConfig.appBundleId
      //platformConfig.appCategoryType
      //platformConfig.extendInfo
      //platformConfig.extraResource
      //platformConfig.helperBundleId
      //platformConfig.osxSign
      //platformConfig.protocol
      //platformConfig.protocolName
      //platformConfig.protocolName

      return {};
    }

    function getWindowsConfig() {
      //platformConfig.win32metadata
      //platformConfig.win32metadata.CompanyName
      //platformConfig.win32metadata.FileDescription
      //platformConfig.win32metadata.OriginalFilename
      //platformConfig.win32metadata.ProductName
      //platformConfig.win32metadata.InternalName

      return {};
    }

    switch(platform) {
      case 'darwin':
      case 'mac':
      case 'osx':
      case 'macos':
        iconFile = projectDir.path('./resources/osx/icon.icns');
        buildForPlatform = 'darwin';

        platformConfig = getMacOSConfig();
      break;

      case 'windows':
      case 'win32':
      case 'win':
        iconFile = projectDir.path('./resources/windows/icon.ico');
        buildForPlatform = 'win32';

        platformConfig = getWindowsConfig();
      break;

      case 'linux':
        iconFile = projectDir.path('./resources/icons/512x512.png');
        buildForPlatform = 'linux';
      break;

      case 'all':
        platformConfig = utils.extend({}, getMacOSConfig(), getWindowsConfig());
        buildForPlatform = 'all';
      break;

      default:
        buildForPlatform = undefined;
      break;
    }

    var buildConfig = {
      dir: 'build',
      asar: config.platform.asar,
      overwrite: true,
      out: 'output',
      appVersion: appVersion,
      icon: iconFile,
      platform: buildForPlatform,
      overwrite: true
      // appCopyright: ''
      // appVersion: ''
      // buildVersion
      // electronVersion
      // name
    };

    packager(utils.extend({}, buildConfig, platformConfig), function (err, appPaths) {
      done(err);
    });
  });
});

gulp.task('build-ionic', function(done) {
  exec('cd src && npm run build', function (error, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    done(error);
  });
});

// -------------------------------------
// Piece it all together
// -------------------------------------

gulp.task('build:www', function(done) {
  runSequence(
    ['clean', 'build-ionic'], 
    'copy', 
    'finalize', 
    'installDeps', done);
});

gulp.task('build', function(done) {
  runSequence(
    'validate',
    ['clean', 'build-ionic'], 
    'copy', 
    'finalize', 
    'installDeps', 
    'build-electron', done);
});