define(function(require, exports, module) {

    /*
    * @desc 引用模块
    */
    const Stage = require("../generic/Stage");

    /**
     * @desc 场景-游戏一
     */
    const StageGameOne = Stage.extend({
        initialize : function(el,endCallBack){
            var self = this;

            this.el = el;
            this.elm = $(el);
            this.endCallBack = endCallBack;
            this.stageName = "游戏一";

            //游戏开始
            this.elm.on("gameOne:start",function(){
                self.getRandomArray = Random.array(_.gameOneLogo,[1,2,3,4,5,6,7,8]);

                $.each(self.getRandomArray,function(i,c){
                    var target = self.elm.find(".gameOnetag").eq(c-1);
                    target.find(".tag_on").attr("src","image/game1/tag_on.png")
                    target.addClass("turnOn turn0"+i);
                    $(".gameOneBankSite0"+c).show().addClass("turnOn turn0"+i);
                });

                setTimeout(function(){
                    self.elm.find(".gameOnetag,.gameOneBank").removeClass("turnOn turn00 turn01 turn02 turn03 turn04 turn05 turn06 turn07 turn08");

                    self.elm.trigger("gameOne:chose");
                }, (self.getRandomArray.length-1)*2000 + 500);
            });

            //玩家选择
            var nowIndex = 0;
            var nowNum;
            this.elm.on("gameOne:chose",function(e){

                self.elm.find(".gameOnetag").on("singleTap",function(e){
                    if($(this).hasClass("turnOn"))return;

                    var nowNum = $(this).index()+1;
                    $(this).addClass("turnOn");
                    $(".gameOneBankSite0"+nowNum).addClass("turnAuto");

                    if(nowNum == self.getRandomArray[nowIndex]){
                        //选对了
                        if(nowIndex<self.getRandomArray.length-1){
                            nowIndex++;
                        }else{
                            //全对了
                            //console.log("全对了");
                            self.elm.find(".gameOnetag").off("singleTap");

                            setTimeout(function(){
                                $("#gameOneSucc").removeClass('hide');
                                $("#gameOneSucc .alertType02Btn").on("tap",function(){
                                    self.nextStage(self);
                                    $("#gameOneSucc").addClass('hide');
                                })

                            }, 1000);
                        }

                        $(".gameOneBankSite0"+nowNum).show();
                    }else{
                        //选错了
                        _.gameOneChance--;
                        self.elm.find(".gameOnetag").off("singleTap");

                        $("#chances").text(_.gameOneChance);
                        $("#tryAgain").removeClass('hide');

                        $(".gameOneBank").removeClass("turnAuto").hide();

                        $("#tryAgain").on("singleTap",function(e){
                            $("#tryAgain").addClass('hide');
                            //重新开始
                            if(_.gameOneChance>0){

                                self.elm.trigger("gameOne:start");


                                nowIndex = 0;
                            }else{
                                window.location.reload();
                            }
                        });

                        self.elm.find(".gameOnetag").removeClass("turnOn");
                    }
                });

            });

            this._super();
        },
        resize : function(){
            var nowWrap = $(".gameOne.hasLoad");
            if(nowWrap.length>0){
                if(nowWrap.find(".gameOneBg").width()>0){
                    window.gameOneBgWidth = nowWrap.find(".gameOneBg").width();    
                    nowWrap.find(".gameOneTips_on,.gameOneMain").width(gameOneBgWidth || 0);
                }
            
            }
        },
        render : function(){
            $("#gameOneTips").removeClass("hide");

            this._super();
        },
        eventBinding : function(){
            var self = this;

            $("#gameOneTips .alertType01Btn").one("tap",function(){
                $("#gameOneTips").addClass("hide");
                self.resize();
                self.elm.trigger("gameOne:start");
            });
        },
    });

    module.exports = StageGameOne;

});