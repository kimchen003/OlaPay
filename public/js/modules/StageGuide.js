define(function(require, exports, module) {

    /*
    * @desc 引用模块
    */
    const Stage = require("../generic/Stage");
    const SoundControler = require("./SoundControler");

    /**
     * @desc 场景-引导页
     */
    const StageGuide = Stage.extend({
        initialize : function(el,endCallBack){
            this.elm = $(el);
            this.endCallBack = endCallBack;
            this.stageName = "引导页";

            //控制器实例化
            this.soundControler = new SoundControler();

            this._super();
        },
        eventBinding : function(){
            var self = this;

            this.elm.find(".guideBtn img").one("tap",function(){
                //播放音乐
                self.soundControler.playBgm();
                $("#audio_btn").show();

                self.nextStage(self);
            });
        },
    });

    module.exports = StageGuide;

});