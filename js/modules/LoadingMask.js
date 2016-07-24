define(function(require, exports, module) {

    /*
    * @desc 预加载类
    *
    * @param object    蒙版DOM选择器
    * @param array     预加载图片队列
    * @param fundction 成功回调
    *
    */
    var LoadingMask = function(objname, imgarray, fn) {
        this.callback = fn;
        this.objname = objname;
        this.imgarray = imgarray;
        this.init();
        (imgarray && imgarray.length > 0) ? this.getImgNext() : this.onlyshow();
    }

    LoadingMask.prototype = {
        loaded: 0,
        retried: 0,
        curCaseId: 0,
        init: function() {

            this.obj = $(this.objname).show();
            if (this.obj.find('.percent').length > 0)
                this.percent = this.obj.find('.percent');
        },
        show: function() {
            this.obj.show();
        },
        hide: function(fn) {
            var self = this;
            self.obj.hide();
            $(".loading_layer_bg").hide();
            fn();
        },
        onlyshow: function() {
            var This = this;
            this.show();
            setTimeout(function() {
                This.hide(This.callback);
            }, 300);
        },
        getImgNext: function() {
            var This = this;
            var MovePoint = function() {
                This.loaded++;
                if ($(".icoMask").length > 0) {
                    var n = Math.ceil(This.loaded / This.imgarray.length * 100);
                    $(".icoMask").css({width: n + '%'});
                    This.obj.find('.hot_number').html('<span>'+n+'%</span>');
                }
                This.retried = 0;
                setTimeout(function() {This.getImgNext() }, 1)
            }
            if (This.loaded >= This.imgarray.length) {
                // if (This.obj.find('.percent').length > 0)
                //     This.percent.html('- 100% -');
                setTimeout(function() { This.hide(This.callback); }, 100);
                This.loaded = 0;
                This.retried = 0;
                return;
            }
            var oImg = new Image();
            oImg.onload = function() {
                MovePoint();
            };
            oImg.onerror = function() {
                This.retried++;
                if (This.retried < 3) {
                    This.getImgNext()
                } else {
                    MovePoint();
                }
            };
            oImg.src = This.imgarray[This.loaded];
            // console.log(oImg.src);
        }
    }

    module.exports = LoadingMask;

});