const gulp = require('gulp');
const clean = require('del');
const babel = require('gulp-babel');

// 发布打包
gulp.task('default', gulp.series(() => {
    return clean(['./lib']);
}, () => {
    return gulp.src('./src/*.js')
        .pipe(babel())
        .pipe(gulp.dest('./lib'));
}, () => {
    return gulp.src('./src/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('./lib'));
}));