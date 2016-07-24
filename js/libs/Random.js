/*
*  @desc 全局随机对象
*/
const Random = {};

/**
 * @desc 获取随机数
 *
 * @param  number 最小值
 * @param  number 最大值
 *
 * @return number 随机数
 */
Random.num = function(Min,Max){
    var Range = Max - Min;
    var Rand = Math.random();
    return(Min + Math.round(Rand * Range));
}

/**
 * @desc 获取随机数组
 *
 * @param number  返回数组的长度
 * @param number  返回原始数组的长度
 * @param boolean 是否允许重复
 * @param array   原始数组
 */
Random.array = function(length,arr,repeat){
    var originalArr = [];
    var result = [];
    var self = this;

    if(arr){
        originalArr = arr.concat();
    }

    while(result.length<length){
        var randomNum = originalArr[self.num(0,originalArr.length-1)]

        if(!repeat){
            if(result.indexOf(randomNum) < 0){
                result.push(randomNum);
            }

        }else{
            result.push(randomNum);
        }

    }

    return result;
}