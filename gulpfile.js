const gulp = require('gulp');
const $ = require('gulp-load-plugins')();


const options = {
  todo: {
    absolute: true
  },
  test: {
    reporter: 'nyan',
  },
  lint: { esversion: 6 },
};

const paths = {
  src: './',
  spec: './spec/*.js',
  js: ['./*.js', './**(!node_modules)/*.js'],
};

gulp.task('default', ['todo', 'test', 'lint'], defaultTask);
gulp.task('todo', toDoTask);
gulp.task('test', testTask);
gulp.task('lint', lintTask);

function defaultTask() {
  console.log("GULP");
}

function testTask() {
  gulp.src(paths.spec)
    .pipe($.mocha(options.test));
}

function toDoTask() {
  gulp.src(paths.js)
    .pipe($.todo(options.todo))
    .pipe(gulp.dest(paths.src));
}

function lintTask() {
  return gulp.src(paths.js)
    .pipe($.jshint(options.lint))
    .pipe($.jshint.reporter('default'));
}