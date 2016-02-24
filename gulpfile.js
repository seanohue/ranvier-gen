const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

const options = {
  todo: {
    absolute: true
  },
  jshint: {
    reporter: 'default'
  },
};

const paths = {
  src: './',
  spec: './spec/*.js',
  js: ['./*.js', './**(!node_modules)/*.js'],
};

gulp.task('default', ['todo'], defaultTask);
gulp.task('todo', toDoTask);

function defaultTask() {
  console.log("GULP");
}

function toDoTask() {
  gulp.src(paths.js)
    .pipe($.todo(options.todo))
    .pipe(gulp.dest(paths.src));
}