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

let paths = {
  copyFromAppDir: [
    './node_modules/**',
    './www/**',
    './routes/**',
    './**/*.+(jpg|png|svg)'
  ]
}

// -------------------------------------
// Tasks
// -------------------------------------

gulp.task('clean', function (done) {
  destDir.dirAsync('.', { empty: true }).then(function() {
    return jetpack.remove('output');
  }).then(function() {
    done();
  })
})

gulp.task('copy', function (done) {
  projectDir.copyAsync('src', destDir.path(), {
    overwrite: true,
    matching: paths.copyFromAppDir
  }).then(function() {
    return projectDir.copyAsync(srcDir.path('./app.js'), destDir.path('./app.js'))
  }).then(function() {
    done();
  })
})

gulp.task('finalize', function (done) {
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

    manifest.productName = appName;

    manifest.env = projectDir.read('config/env_' + utils.getEnvName() + '.json', 'json');

    destDir.write('package.json', manifest);

    done();
  });

});

gulp.task('installDeps', function(done) {
  var packageString = projectDir.read('package.json');

  var packageJSON = JSON.parse(packageString);
  var installString = 'cd build && npm install ';

  if(packageJSON.dependencies !== undefined) {
    Object.keys(packageJSON.dependencies).forEach(function(dep) {
      let version = packageJSON.dependencies[dep];

      installString += dep + '@' + version + ' ';
    })

    installString += '--save';

    console.log('Running: ' + installString);

    exec(installString, function(error, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      done(error);
    })
  }else{
    done('Error: Package.json is missing dependencies!');
  }
})

gulp.task('watch', function () {
  watch('src/**/*.js', batch(function (events, done) {
    gulp.start('bundle-watch', done)
  }))
  watch(paths.copyFromAppDir, { cwd: 'app' }, batch(function (events, done) {
    gulp.start('copy-watch', done)
  }))
})

gulp.task('build-electron', function(done) {
  var configXml = srcDir.read('./config.xml', 'utf8');

  parseString(configXml, function (err, result) {
    var appVersion = result.widget.$.version;

    packager({
      dir: 'build',
      asar: true,
      // todo: icon
      overwrite: true,
      out: 'output',
      appVersion: appVersion
    }, function (err, appPaths) {
      done(err);
    })
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