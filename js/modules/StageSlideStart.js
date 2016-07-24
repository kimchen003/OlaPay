define(function(require, exports, module) {

    /*
    * @desc 引用模块
    */
    const touch = require("touch");
    const Stage = require("../generic/Stage");

    /**
     * @desc 场景-滑动开始页
     */
    const StageSlideStart = Stage.extend({
        initialize : function(el,endCallBack){
            this.elm = $(el);
            this.endCallBack = endCallBack;
            this.stageName = "滑动开始页";

            this._super();
        },
        eventBinding : function(){
            var self = this;
            var dx,dy;
            var percent;

            $("#slideStartPage")[0].addEventListener("touchstart",function(e){
                e.preventDefault();
            });

            touch.on('.trainActive', 'swipeRight drag', function(ev){
                dx = dx || 0;
                dy = dy || 0;
                var offx = dx + ev.x;
                var offy = dy + ev.y;
                if(offx>0){
                    percent = offx/$('.slideTips img').width()*100;
                    if(percent>60){
                        percent = 60;
                    }
                    $(".trainActive").css("left",(percent-60)+"%");
                }


            });

            touch.on('.trainActive', 'swipeend', function(ev){
                if(percent< 60){
                    $(".trainActive").css("left","-60%");
                }else{
                    //滑动成功
                    $(".slideSucc").removeClass('hide');
                }
            })

            $("#slideSucc .alertType01Btn").one("tap",function(){
                $(".slideSucc").addClass('hide');
                self.nextStage(self);
            });

        },
    });

    module.exports = StageSlideStart;

});