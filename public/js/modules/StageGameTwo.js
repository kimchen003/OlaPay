define(function(require, exports, module) {

    /*
    * @desc 引用模块
    */
    const Stage = require("../generic/Stage");

    /**
     * @desc 场景-游戏二
     */
    const StageGameTwo = Stage.extend({
        initialize : function(el,endCallBack){
            var self = this;

            this.el = el;
            this.elm = $(el);
            this.endCallBack = endCallBack;
            this.stageName = "游戏二";

            //移除不用的
            if(el == '#gameTwo'){
                var gameRandArr = [1,2,4,5,7,8,9];
            }else{
                var gameRandArr = [1,2,3,4,6,7,8,9];
            }

            //游戏开始
            this.elm.on("gameTwo:start",function(){
                if(self.elm.startHasRun)return;
                self.elm.startHasRun = true;
                self.getRandomArray = Random.array(_.gameTwoLogo,gameRandArr);
                console.log(self.getRandomArray);
                $.each(self.getRandomArray,function(i,c){
                    var target = self.elm.find(".gameTwoLogo").eq(c-1).addClass("canSelected");
                    target.show();

                    self.elm.trigger("gameTwo:chose");
                });

            });

            //玩家选择
            var nowNum;
            var answer = [];
            this.elm.on("gameTwo:chose",function(e){

                self.elm.find(".gameTwoLogo.canSelected").on("tap",function(e){
                    if($(this).hasClass("on"))return;

                    var nowNum = $(this).index()+1;

                    if(self.getRandomArray.indexOf(nowNum)>=0){

                        //选对了
                        if(answer.indexOf(nowNum)<0){
                            answer.push(nowNum);
                            $(this).addClass("on");
                        }

                        //全对了
                        if(answer.length>=self.getRandomArray.length){
                            //console.log("全对了");
                            setTimeout(function(){
                                self.elm.trigger("gameTwo:over");
                            }, 300);
                        }

                    }else{
                        //选错了
                        //console.log("选错了");
                    }

                });

            });

            //游戏结束
            this.elm.on("gameTwo:over",function(){
                $("#gameTwoSucc").removeClass("hide");
                $("#gameTwoSucc .alertType02Btn").one("singleTap",function(){
                    $("#gameTwoSucc").addClass("hide");

                    self.elm.trigger("gameTwo:userinfo");
                });
            });

            //提交用户信息
            this.elm.on("gameTwo:userinfo",function(){
                $("#userInfo").show();
            });

            this._super();
        },
        resize : function(){
            var nowWrap = $(".gameTwo.hasLoad");
            if(nowWrap.length>0){
                nowWrap.find(".gameTwoLogoWrap,.gameTwoMain").width(nowWrap.find(".gameTwoBg").width())
            }
        },
        render : function(){
            $("#logoAmount").text(_.gameTwoLogo);
            $("#gameTwoTips").removeClass("hide");

            this._super();
        },
        eventBinding : function(){
            var self = this;

            var hasrun = false;
            $("#gameTwoTips .alertType01Btn").one("singleTap",function(){
                if(!hasrun){
                    $("#gameTwoTips").addClass("hide");
                    self.elm.removeClass("hide")
                    self.elm.trigger("gameTwo:start");

                    hasrun = true;
                };

            });
        },
    });

    module.exports = StageGameTwo;

});
