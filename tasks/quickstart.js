'use strict'

const exec                = require('child_process').exec;
const gulp                = require('gulp');
const inquirer            = require('inquirer');
const runSequence         = require('run-sequence');
const emoji               = require('node-emoji')

gulp.task('quickstart-ionic', function(done) {
  var runner = exec('rm -r src && ionic start src --v2', function(error, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    done(error);
  });

  runner.stdout.pipe(process.stdout);
});

gulp.task('quickstart-done', function() {
  console.log(emoji.get('tada') + '  Your project is set up and built. Check out the "output" directory for your binary.');
})

gulp.task('quickstart', function(done) {
  inquirer.prompt([{
    type: 'confirm',
    message: 'Running the quickstart command will delete anything in the source and reset the project. Are you sure you want to run this command?',
    default: false,
    name: 'start'
  },{
    type: 'confirm',
    message: 'Are you really really really sure?',
    default: false,
    name: 'startConfirm'
  }]).then(function(answers) {
    if(answers.start && answers.startConfirm) {
      runSequence(
        'quickstart-ionic',
        'init',
        'build',
        'quickstart-done', done);
    }else{
      done();
    }
  });
});
