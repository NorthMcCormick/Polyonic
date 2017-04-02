'use strict'

const childProcess        = require('child_process');
const electron            = require('electron');
const gulp                = require('gulp');
const argv                = require('yargs').argv;

gulp.task('run', function(error) {
  if(argv.prod !== undefined) {
    console.log('Starting app from "build" without live-reload...')
    childProcess.spawn(electron, ['./build'], {
      stdio: 'inherit'
    })
    .on('close', function () {
        // User closed the app. Kill the host process.
      process.exit()
    })
  }else{
    console.log('Starting app from "src" with live-reload...')
    var runner = childProcess.exec('cd src && gulp dev', function (error, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);

      done(error);
    });

    runner.stdout.pipe(process.stdout);

    runner.on('close', function() {
      process.exit();
    });
  }
});
