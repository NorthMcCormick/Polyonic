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

// -------------------------------------
// Configure paths
// -------------------------------------

const projectDir = jetpack;
const srcDir = projectDir.cwd('./src');
const destDir = projectDir.cwd('./build');
const binDir = projectDir.cwd('./test-darwin-x64');

const config              = require(srcDir.path('./polyonic.config.js'));

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

gulp.task('testBuild', function() {
  // Quickly validate that we didn't break anything here
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

  parseString(configXml, function (err, result) {
    var appVersion = result.widget.$.version;

    var iconFile = null;

    switch(process.platform) {
      case 'darwin':
        iconFile = projectDir.path('./resources/osx/icon.icns');
      break;
    }

    packager({
      dir: 'build',
      asar: config.platform.asar,
      // todo: icon
      overwrite: true,
      out: 'output',
      appVersion: appVersion,
      icon: iconFile
    }, function (err, appPaths) {
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
    ['clean', 'build-ionic'], 
    'copy', 
    'finalize', 
    'installDeps', 
    'build-electron', done);
});