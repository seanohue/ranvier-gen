const gulp = require('gulp');
const $ = require('gulp-load-plugins')();


const options = {
  todo: {
    absolute: true
  },
  test: {
    reporter: 'nyan',
  },
  lint: {
    // reporter: 'default'
  },
};

const paths = {
  src: './',
  spec: './spec/*.js',
  js: ['./*.js', './**(!node_modules)/*.js'],
};

gulp.task('default', ['todo', 'test'], defaultTask);
gulp.task('todo', toDoTask);
gulp.task('test', testTask);

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