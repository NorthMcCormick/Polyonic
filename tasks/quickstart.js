'use strict'

const childProcess        = require('child_process');
const electron            = require('electron');
const gulp                = require('gulp');
const argv                = require('yargs').argv;
const inquirer            = require('inquirer');
const runSequence         = require('run-sequence');

gulp.task('quickstart-ionic', function(done) {
  var runner = exec('rm -r src && ionic start src --v2', function(error, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    done(error);
  });

  runner.stdout.pipe(process.stdout);
});

gulp.task('quickstart', function(done) {
  inquirer.prompt([{
    type: 'confirm',
    message: 'Running the quickstart command will delete anything in the source and reset the project. Are you sure you want to run this command?',
    default: false,
    name: 'start'
  }]).then(function(answers) {
    console.log(answers);

    if(answers.start) {
      runSequence(
        'quickstart-ionic',
        'build', done);
    }

    done();
  });
});
