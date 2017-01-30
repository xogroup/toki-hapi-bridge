'use strict';

var Gulp         = require('gulp'),
    Shell        = require('gulp-shell'),
    Del          = require('del'),
    VinylPaths   = require('vinyl-paths'),
    Fs           = require('fs'),
    Promise      = require('bluebird'),
    packageInfo  = require('./package.json'),
    childProcess = require('child_process');

var exec = function exec(command) {
    return new Promise(function callback(resolve, reject) {
        childProcess.exec(command, function callback(error, response) {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
};

Gulp.task('pack', ['clean'], Shell.task(['npm pack']));

Gulp.task('move', ['pack'], function move() {
    return new Promise(function promise(resolve, reject) {
        var vp = VinylPaths();

        Gulp.src('*.tgz')
            .pipe(vp)
            .pipe(Gulp.dest('build/Release'))
            .on('end', function promise() {
                Del(vp.paths)
                    .then(resolve)
                    .catch(reject);
            });
    });
});

Gulp.task('npmpush', ['validate', 'move'], function npmpush() {
    return Gulp
        .src('build/Release/*.tgz')

        .pipe(Shell([
            'curl -f -F package=@<%= file.path %> https://P2NoU4CksQg5WPReyUxy@push.fury.io/xogroupinc/'
        ]));
});

Gulp.task('clean', function clean() {
    return new Promise(function promise(resolve, reject) {
        Del(['build/Release/*.tgz'])
            .then(resolve)
            .catch(reject);
    });
});

Gulp.task('versionExist', function versionExist() {
    return exec('npm show ' + packageInfo.name + ' version')
        .then(function versionResponse(version) {
            if (version.replace(/(\r\n|\n|\r)/gm, '') === packageInfo.version) {
                console.error('package ' + packageInfo.name + ' with version ' + packageInfo.version + ' already exist in Gemfury');
                process.exit(1);
            }
        })
        .catch(function errorResponse() {
            console.log('package ' + packageInfo.name + ' being added for the first time');
        });
});

Gulp.task('shrinkwrapExist', function shrinkWrapExist() {
    Fs.stat('npm-shrinkwrap.json', function callback(error) {
        if (error) {
            console.log('npm-shrinkwrap.json file does not exist');
            process.exit(1);
        }
    });
});

Gulp.task('validate', ['versionExist', 'shrinkwrapExist'], function validate() {});

Gulp.task('build', ['npmpush'], function build() {
    process.nextTick(function nTick() {
        process.exit(0);
    });
});
