'use strict';
var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var data = require('gulp-data');
var browserSync = require('browser-sync').create();
var ejs = require('gulp-ejs');
var cleanCSS = require('gulp-clean-css');
var less = require('gulp-less')
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var tplDir = './templates';  // 模版目录
var distDir = './dist';      // 生成目录
var imageMin = require('gulp-imagemin');
var runSequence = require('run-sequence');
var concat = require("gulp-concat");
var similar='_SM';
// 模版合并
gulp.task('styles', function () {
    return gulp.src('./templates/css/**/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(distDir+'/css'));
});
gulp.task('less', function () {
    return gulp.src('./templates/css/**/*.less')
        .pipe(less())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(distDir+'/css'));
})
gulp.task('scripts', function() {
    return gulp.src(['./templates/js/**/*.js',"!./templates/js/common/fn.js","!./templates/js/profiles/*.js"])
        .pipe(plumber())
       // .pipe(uglify())
        /*  .pipe(rename(function (path) {
            path.basename += ".min";
        }))*/
        .pipe(gulp.dest(distDir+'/js'));

});
gulp.task('copy-ejs', function () {
    return gulp.src(tplDir +'/compileEjs/*.ejs').pipe(gulp.dest(distDir+'/compileEjs'));
});
gulp.task('copy-css', function () {
    return gulp.src(tplDir +'/js/**/*.css').pipe(gulp.dest(distDir+'/js'));
});
gulp.task('copy-js-gif', function () {
    return gulp.src(tplDir +'/js/**/*.gif').pipe(gulp.dest(distDir+'/js'));
});
gulp.task('copy-font', function () {
    return gulp.src(tplDir +'/fonts/*').pipe(gulp.dest(distDir+'/fonts'));
});
gulp.task('image',function(){
    return gulp.src(tplDir+'/images/*.*')
        //.pipe(imageMin({progressive: true}))
        .pipe(gulp.dest(distDir+'/images'));
})
gulp.task('ejs', function () {
    return gulp.src(tplDir + '/**/*.html')
        .pipe(data(function (file) {
            var filePath = file.path;
            // global.json 全局数据，页面中直接通过属性名调用
            try{
                return Object.assign(JSON.parse(fs.readFileSync(path.join(path.dirname(filePath)+'/json', 'global.json'))), {
                    // local: 每个页面对应的数据，页面中通过 local.属性 调用
                    local: JSON.parse(fs.readFileSync(path.join(path.dirname(filePath)+'/json', path.basename(filePath, '.html') + '.json')))//path.basename(filePath, '.html')拿到文件名，第二个参数是过滤掉这个字段；
                })
            }catch(e){
                try{
                    var fileName=path.basename(filePath, '.html');
                    if(fileName.indexOf(similar)>0){
                        return Object.assign(JSON.parse(fs.readFileSync(path.join(path.dirname(filePath)+'/json', 'global.json'))), {
                            local: JSON.parse(fs.readFileSync(path.join(path.dirname(filePath)+'/json', fileName.substring(0,fileName.indexOf(similar)) + '.json')))
                        })
                    }else{
                        return Object.assign(JSON.parse(fs.readFileSync(path.join(path.dirname(filePath)+'/json', 'global.json'))), {
                            local: {}
                        })
                    }
                }catch(e){}
            }
        }))
        .pipe(ejs().on('error', function (err) {
            gutil.log(err);
            this.emit('end');
        }))
        .pipe(gulp.dest(distDir));
});

gulp.task("develop",function(){
    gulp.src(["./templates/js/profiles/develop.js","./templates/js/common/fn.js"])
    .pipe(concat('fn.js'))
    //.pipe(uglify())
    .pipe(gulp.dest(distDir+"/js/common"));
    return runSequence(['image','styles','less','scripts','ejs','copy-ejs','copy-css','copy-font','copy-js-gif']);
});
gulp.task("test",function(){
    gulp.src(["./templates/js/profiles/test.js","./templates/js/common/fn.js"])
    .pipe(concat('fn.js'))
    //.pipe(uglify())
    .pipe(gulp.dest(distDir+"/js/common"));
    return runSequence(['image','styles','less','scripts','ejs','copy-ejs','copy-css','copy-font','copy-js-gif']);
});
gulp.task("uat",function(){
    gulp.src(["./templates/js/profiles/uat.js","./templates/js/common/fn.js"])
    .pipe(concat('fn.js'))
    //.pipe(uglify())
    .pipe(gulp.dest(distDir+"/js/common"));
    return runSequence(['image','styles','less','scripts','ejs','copy-ejs','copy-css','copy-font','copy-js-gif']);
});
gulp.task("prod",function(){
    gulp.src(["./templates/js/profiles/prod.js","./templates/js/common/fn.js"])
    .pipe(concat('fn.js'))
    //.pipe(uglify())
    .pipe(gulp.dest(distDir+"/js/common"));
    return runSequence(['image','styles','less','scripts','ejs','copy-ejs','copy-css','copy-font','copy-js-gif']);
});


// 开发服务
gulp.task('file-watch', ['image','ejs','styles','less','scripts-dev','copy-ejs','copy-css','copy-font'], browserSync.reload,function(){
    // 无论是数据文件更改还是模版更改都会触发页面自动重载
    gulp.watch(tplDir + '/**/*.*', ['file-watch']);
});
gulp.task('scripts-dev', function() {
    return gulp.src(['./templates/js/**/*.js',"!./templates/js/common/fn.js","!./templates/js/profiles/*.js"])
        .pipe(plumber())
        //.pipe(uglify())
       /*  .pipe(rename(function (path) {
            path.basename += ".min";
        }))*/
        .pipe(gulp.dest(distDir+'/js'));
});
gulp.task('dev', function () {
    browserSync.init({
        server: {
            baseDir: distDir,
            index:"/html/Y_docIndex.html"
        },
        port:8081,
        browser: "chrome",
        notify: false,      //禁用浏览器的通知元素
        //files: ['**'],
        reloadDebounce: 0
    });

    gulp.src(["./templates/js/profiles/develop.js","./templates/js/common/fn.js"])
    .pipe(concat('fn.js'))
    .pipe(gulp.dest(distDir+"/js/common"));
    gulp.watch(tplDir + '/**/*.*', ['file-watch']);
    runSequence("file-watch")
});
gulp.task('default',['image','styles','less','scripts-dev','ejs','copy-ejs','dev','copy-css','copy-font','copy-js-gif']);
