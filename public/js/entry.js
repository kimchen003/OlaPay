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
    const SoundControler = require("./modules/SoundControler");
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

        //控制器实例化
        this.screenControler = new ScreenControler();
        this.soundControler = new SoundControler();

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

                //游戏二有两个场景随机出现
                var nowStage = ["#gameTwo","#gameTwo2"][Random.num(0,1)];
                nowStage = "#gameTwo2";
                self.stageGameTwo.initialize(nowStage,function(){
                    //console.log("游戏二结束");
                });
            });

            //加载音频
            self.soundControler.loadingSource(function(){
                //预加载图片
                var loading = new LoadingMask('.loading', ImageSources, function(){
                        self.render();
                    })

            });

            //站点信息图
            window.showSiteInfoPage = function(){
                _.pageNeedDir = 2;
                self.screenControler.handleScreenTips();

                $("#userInfo,.gameTwo").hide();

                $(".gameOnetag").addClass('turnOn');
                $(".gameOnetag").find(".tag_on").attr("src","image/game1/tag_on.png");
                $(".gameOneBank").addClass('turnAuto').show();

                $("#gameOne").show();
            }

            //showSiteInfoPage();

        },
        render : function(){
            //注意：这里可以跳过流程,直接去到相应的关卡

            this.elm.trigger("stage:guide");
            //this.elm.trigger("stage:slideStart");
            //this.elm.trigger("stage:gameOne");
            //this.elm.trigger("stage:gameTwo");

            //解决点透问题
            FastClick.attach(document.body);

            this.eventBinding();
        },
        eventBinding : function(){
            var self = this;

            //音乐控制按钮
            $("#audio_btn").on("click",function(){
                if($(this).hasClass("rotate")){
                    //关闭音乐
                    $(this).removeClass('rotate');
                    self.soundControler.stopBgm();
                }else{
                    //开启音乐
                    $(this).addClass('rotate');
                    self.soundControler.playBgm();
                }
            });
        }
    };

    const entry = new Entry();

});