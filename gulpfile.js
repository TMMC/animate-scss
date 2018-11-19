"use strict";

const pkg                    = require('./package.json'),
path                         = require('path'),
{ exec }                     = require('child_process'),
del                          = require('del'),
{ src, dest, watch, series } = require('gulp'),
header                       = require('gulp-header'),
rename                       = require('gulp-rename'),
sass                         = require('gulp-sass'),
autoprefixer                 = require('gulp-autoprefixer'),
ansi                         = require('ansi-colors'),
banner                       = [
  '/*!',
  ' * ' + pkg.name + ' - v.' + pkg.version,
  ' * Licensed under the MIT license - http://opensource.org/licenses/MIT',
  ' * Copyright (c) ' + new Date().getFullYear() + ' ' + pkg.author.name + ' - ' + pkg.author.url,
  ' * ',
  ' * ' + pkg.description,
  ' * ' + pkg.config.origin.name + ' - v.' + pkg.config.origin.version + ' - ' + pkg.homepage,
  ' * Copyright (c) ' + new Date().getFullYear() + ' ' + pkg.config.origin.author.name + ' - ' + pkg.config.origin.author.url,
  ' */\n\n'
].join('\n');

sass.compiler                = require('node-sass');

// ==============================================
// === Standalone tasks
// ==============================================

// == stylesheets: process SASS files (minify if in production mode) and autoprefix compiled CSS
function stylesheets() {
  return src(pkg.config.src + '/animate.scss')
    .pipe(sass(pkg.config.sassOptions.dev).on('error', sass.logError))
    .pipe(header(banner))
    .pipe(autoprefixer(pkg.config.autoprefixerOptions))
    .pipe(dest(pkg.config.dist))
    .pipe(sass(pkg.config.sassOptions.prod).on('error', sass.logError))
    .pipe(rename({ extname : '.min.css' }))
    .pipe(autoprefixer(pkg.autoprefixerOptions))
    .pipe(dest(pkg.config.dist));
}
stylesheets.description = 'Process SASS files and autoprefix compiled CSS.';
exports.stylesheets = stylesheets;

// == watcher: watch for changes in SASS sources to run corresponding task
function watcher() {
  watch(pkg.config.src + '/**/*.{scss,sass}', { ignoreInitial: false }, stylesheets);
}
watcher.description = 'Watch for changes in SASS sources to run corresponding task.';
exports.watcher = watcher;

// == clean: remove dist directory
function clean() {
  return del(pkg.config.dist).then(paths => {
    if (paths.length) {
      console.log(ansi.yellow.bold('Deleted files and folders:\n'), ansi.yellow(paths.join('\n')));
    } else {
      console.log(ansi.yellow.bold('Location already cleaned.'));
    }
  });
}
clean.description = 'Clean and remove `dist` directory.';
exports.clean = clean;

// == availTasks: log available tasks to console
function availTasks(done) {
  var command = 'gulp --tasks-simple';
  if (process.argv.indexOf('--verbose') > -1) {
    command = 'gulp --tasks';
  }
  exec(command, function (err, stdout, stderr) {
    done(console.log(ansi.cyan.bold('Available tasks are:\n') + ansi.cyan(stdout)));
  });
}
availTasks.description = 'Log available tasks to console as plain text list.';
availTasks.flags = {
  '--verbose': 'Display tasks dependency tree instead of plain text list.'
};
// exports.availTasks = availTasks;

// == default: export `availTasks` as default task
exports.default = availTasks;

// ==============================================
// === Combo tasks
// ==============================================

// == build: build project from scratch (clean and compile)
var build = series(clean, stylesheets);
build.description = 'Build project from scratch (clean and compile).';
exports.build = build;

// == buildWatch: build project from scratch (clean and compile) and watch for changes
var buildWatch = series(clean, watcher);
buildWatch.description = 'Build project from scratch (clean and compile) and watch for changes.';
exports.buildWatch = buildWatch;
