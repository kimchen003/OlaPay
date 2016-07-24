define(function(require, exports, module) {

    /**
     * @desc 引用模块
     */
    require('zepto');
    require('common');
    require("Random");
    require("fastclick");
    require("./nodejs_controls/ImageSources");
    const LoadingMask = require("./modules/LoadingMask");
    const ScreenControler = require("./modules/ScreenControler");
    const StageGuide = require("./modules/StageGuide");
    const StageSlideStart = require("./modules/StageSlideStart");
    const StageGameOne = require("./modules/StageGameOne");
    const StageGameTwo = require("./modules/StageGameTwo");

    /**
     * @desc 入口类
     */
    const Entry = function(){
        //容器DOM
        this.elm = $(".mainWrap");

        //屏幕控制器实例化
        this.screenControler = new ScreenControler();

        //场景实例化
        this.stageGuide = new StageGuide();
        this.stageSlideStart = new StageSlideStart();
        this.stageGameOne = new StageGameOne();
        this.stageGameTwo = new StageGameTwo();

        this.initialize();
    };

    Entry.prototype = {
        initialize : function(){
            var self = this;

            //监听屏幕方向
            this.screenControler.startWatching();

            //进入引导页
            this.elm.on("stage:guide",function(){
                _.pageNeedDir = 1;
                self.screenControler.handleScreenTips();

                self.stageGuide.initialize("#guidePage",function(){
                    //console.log("引导页结束");


                    self.elm.trigger("stage:slideStart");
                });
            });

            //进入滑动开始页
            this.elm.on("stage:slideStart",function(){
                _.pageNeedDir = 2;
                self.screenControler.handleScreenTips();

                self.stageSlideStart.initialize("#slideStartPage",function(){
                    //console.log("滑动刷新页结束");

                    self.elm.trigger("stage:gameOne");
                });
            });

            //进入游戏一
            this.elm.on("stage:gameOne",function(){
                _.pageNeedDir = 2;
                self.screenControler.handleScreenTips();

                self.stageGameOne.initialize("#gameOne",function(){
                    //console.log("游戏一结束");

                    self.elm.trigger("stage:gameTwo");
                });
            });

            //进入游戏二
            this.elm.on("stage:gameTwo",function(){
                _.pageNeedDir = 2;
                self.screenControler.handleScreenTips();

                self.stageGameTwo.initialize("#gameTwo",function(){
                    //console.log("游戏二结束");
                });
            });

            //预加载图片
            var loading = new LoadingMask('.loading', ImageSources, function(){
                //console.log("加载完毕");

                self.render();
            });
        },
        render : function(){
            //注意：这里可以跳过流程,直接去到相应的关卡

            this.elm.trigger("stage:guide");
            //this.elm.trigger("stage:slideStart");
            //this.elm.trigger("stage:gameOne");
            //this.elm.trigger("stage:gameTwo");

            //解决点透问题
            FastClick.attach(document.body);
        }
    };

    const entry = new Entry();

});