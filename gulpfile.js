'use strict';

var babelify = require('babelify');
var browserSync = require('browser-sync');
var buffer = require('vinyl-buffer');
var changed = require('gulp-changed');
var copy = require('gulp-copy');
var csso = require('gulp-csso');
var del = require('del');
var electron = require('gulp-electron');
var gulp = require('gulp');
var notify = require('gulp-notify');
var sass = require('gulp-sass');
var shell = require('gulp-shell');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var inject = require('gulp-inject');
var getMainBowerFiles = require('main-bower-files');

var packageJson = require('./package.json');


gulp.task('clean', function () {
    return del(['dist', 'release']);
});

gulp.task('copy:images', function () {
    return gulp.src('module/**/images/**/*').pipe(gulp.dest('dist/app/module'));
});

gulp.task('copy:misc', function () {
    return gulp.src(['index.js', 'package.json']).pipe(gulp.dest('dist/app'));
});

gulp.task('copy:templates', function () {
    return gulp.src(['module/**/view/**/*.html']).pipe(copy('dist/app'));
});

gulp.task('copy:assets', function () {
    gulp.src(getMainBowerFiles()).pipe(copy('dist/app'));

    var assets = [
        'module/**/src/**/*.js'
    ];
    gulp.src(assets).pipe(copy('dist/app'));

    var target = gulp.src('module/Application/view/layout.html');
    var bowerFiles = getMainBowerFiles();
    var sources = gulp.src(bowerFiles, {read: false});

    return target
        .pipe(inject(sources, {
            name: 'bower',
            addRootSlash: false
        }))
        .pipe(inject(gulp.src(assets), {
            addRootSlash: false
        }))
        .pipe(gulp.dest('dist/app'));
});

gulp.task('copy', ['copy:assets', 'copy:images', 'copy:templates', 'copy:misc']);

gulp.task('styles', function () {
    return gulp.src('module/**/public/scss/*.scss')
        .pipe(changed('dist/app'))
        .pipe(sass({
            errLogToConsole: true
        }))
        .on('error', notify.onError())
        .pipe(csso())
        .pipe(gulp.dest('dist/app/module'));
});

gulp.task('browserSync', function () {
    var bs = browserSync.create();

    bs.watch('module/**/*').on('change', function () {
        gulp.start(['copy', 'styles']);
    });
});

gulp.task('electron', function () {
    let cmd = 'node `which electron` dist/app';

    return gulp.src('', {read: false})
        .pipe(shell(cmd));


    // var cmd = '';
    switch (process.platform) {
        case 'darwin':
            cmd = './node_modules/electron-prebuilt/dist/Electron.app/Contents/MacOS/Electron dist/app';
            break;
        case 'win32':
            cmd = 'node_modules\\electron-prebuilt\\dist\\electron.exe dist\\app';
            break;
        case 'linux':
            cmd = './node_modules/electron-prebuilt/dist/electron dist/app';
            break;
        default:
            console.log(process.platform + ' is not supported.');
            return;
    }

    return gulp.src('', {read: false})
        .pipe(shell(cmd));
});

gulp.task('release', function () {
    gulp.src('')
        .pipe(electron({
            src: './dist/app',
            packageJson: packageJson,
            release: './release',
            cache: './cache',
            version: 'v0.37.4',
            rebuild: false,
            platforms: ['win32-ia32', 'darwin-x64']
        }))
        .pipe(gulp.dest(''));
});

gulp.task('watch', ['clean'], function () {
    gulp.start(['copy', 'styles', 'browserSync', 'electron']);
});
gulp.task('build', ['clean'], function () {
    process.env.NODE_ENV = 'production';

    gulp.start(['copy', 'styles', 'release']);
});

gulp.task('default', function () {
    console.log('Run `gulp watch` or `gulp build`');
});
