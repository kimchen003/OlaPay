define(function(require, exports, module) {

    /*
    * @desc 引用模块
    */
    const Stage = require("../generic/Stage");

    /**
     * @desc 场景-引导页
     */
    const StageGuide = Stage.extend({
        initialize : function(el,endCallBack){
            this.elm = $(el);
            this.endCallBack = endCallBack;
            this.stageName = "引导页";

            this._super();
        },
        eventBinding : function(){
            var self = this;

            this.elm.find(".guideBtn img").one("tap",function(){
                self.nextStage(self);
            });
        },
    });

    module.exports = StageGuide;

});