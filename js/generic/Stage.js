define(function(require, exports, module) {

    /*
    * @desc 引用模块
    */
    require('Class');

    /*
    *  @desc 场景类
    */
    const Stage = Object.extend({
        initialize : function(endCallBack){
            if(this.elm.hasClass('hasLoad'))return;
            this.render();
            this.elm.addClass('hasLoad');
        },
        eventBinding : function(){},
        nextStage : function(self){
            //console.log(this.stageName+"内置回调");

            this.elm.addClass('hide');
            self.endCallBack&&self.endCallBack();
        },
        render : function(){
            this.elm.removeClass('hide');
            this.eventBinding();
        }
    });

    module.exports = Stage;
});
