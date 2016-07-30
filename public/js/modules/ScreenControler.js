define(function(require, exports, module) {

    /*
    * @desc 引用模块
    */
    const StageGameOne = require("./StageGameOne");
    const StageGameTwo = require("./StageGameTwo");
    const StageSlideStart = require("./StageSlideStart");

    const stageGameOne = new StageGameOne();
    const stageGameTwo = new StageGameTwo();
    const stageSlideStart = new StageSlideStart();

    /*
    * @desc 屏幕操作类
    */
    const ScreenControler = function(){

    };

    /*
    * @desc 自动监听屏幕方向
    */
    ScreenControler.prototype.startWatching = function(){

        this.handleScreenTips();
        $(window).resize(this.handleScreenTips);
    }

    /*
    * @desc 监听屏幕方向
    */
    ScreenControler.prototype.handleScreenTips = function(){
        var width = $(window).width();
        var height = $(window).height();

        var nowPageDir = parseFloat(width)<parseFloat(height)?1:2;

        stageGameOne.resize();
        stageGameTwo.resize();
        stageSlideStart.resize();

        if(nowPageDir != _.pageNeedDir){
            switch(_.pageNeedDir){
                case 1:
                    //需要竖屏
                    $("#crossScreenTips").addClass("hide");
                    $("#verticalScreenTips").removeClass('hide');
                    break;
                default:
                    //需要横屏
                    $("#crossScreenTips").removeClass("hide");
                    $("#verticalScreenTips").addClass('hide');
                    break;
            };
        }else{
            $("#crossScreenTips").addClass("hide");
            $("#verticalScreenTips").addClass('hide');
        }

    }

    module.exports = ScreenControler;

});