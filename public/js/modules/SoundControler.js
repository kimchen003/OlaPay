define(function(require, exports, module) {

    /*
    * @desc 引用模块
    */
    require("preloadjs");
    require("soundjs");

    /*
    * @desc 音乐操作类
    */
    const SoundControler = function(){

    };

    /*
    * @desc 加载音乐资源
    *
    * @param function 加载完成回调
    */
    SoundControler.prototype.loadingSource = function(cb){

        var queue = new createjs.LoadQueue();
            queue.installPlugin(createjs.Sound);
            queue.on("complete", handleComplete, this);
            queue.loadFile({src:"sound/bgm.mp3", id:"bgm"});

            function handleComplete() {
                cb();
            }

    }

    /*
    * @desc 播放背景音乐
    */
    SoundControler.prototype.playBgm = function(){
        createjs.Sound.play("bgm",{loop:10000});
    }

    /*
    * @desc 停止背景音乐
    */
    SoundControler.prototype.stopBgm = function(){
        createjs.Sound.stop("bgm");
    }

    module.exports = SoundControler;

});