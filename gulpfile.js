/*
*   @desc 模块依赖
*/
var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');

var lessCorePaths = path.join(__dirname, '/less/**/**/*.less');

/**
 * 获取文件夹下面的所有的文件(包括子文件夹)
 * @param {String} dir
 * @param {Function} callback
 * @returns {Array}
 */
var imageSourcePath = path.join(__dirname,"image");
var fs = require('fs'),
    util = require('util'),
    Path = imageSourcePath;

var arr = [];

function explorer(Path){

    fs.readdir(Path, function(err, files){
        //err 为错误 , files 文件名列表包含文件夹与文件
        if(err){
            console.log('error:\n' + err);
            return;
        }

        files.forEach(function(file){

            fs.stat(Path + '/' + file, function(err, stat){
                if(err){console.log(err); return;}
                if(stat.isDirectory()){
                    // 如果是文件夹遍历
                    explorer(Path + '/' + file);
                }else{
                    // 读出所有的文件
                    //console.log('文件名:' + path + '/' + file);
                    var filePath = "\'"+ Path.replace(/.+\\OlaPay\\/,"") + '/' + file+"\'";
                    arr.push(filePath);

                    var txt = ( ("var ImageSources = ["+arr.join(",")+"]").replace(/\'\][\'|\;]/ig,"") ) +";";

                    fs.writeFile(path.join(__dirname,"js","nodejs_controls","ImageSources.js"),txt,function (err) {
                         if (err) throw err ;
                    });
                }
            });


        });


    });
}
explorer(Path);

/*
*  @desc 定义任务
*/
gulp.task('compress:less', function(){
    return gulp.src('less/**/all.less')
    .pipe(less())
    .pipe(rename(function(path){
        path.basename =  'base';
        path.dirname = "";
    }))
    .pipe(gulp.dest('css'));
});

gulp.task('build',function(done){
    runSequence(
        "compress:less",
    done);
});

gulp.task('default',['build'],function(){
    gulp.watch([lessCorePaths],['compress:less']);
});

