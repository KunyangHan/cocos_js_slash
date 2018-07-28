var Config = require("Config");

cc.Class({
    extends: cc.Component,

    properties: {
        // 这个属性引用了星星预制资源
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 星星产生后消失时间的随机范围
        maxStarDuration: 0,
        minStarDuration: 0,

        // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
        player: {
            default: null,
            type: cc.Node
        },
        // score label 的引用
        scoreDisplay: {
            default: null,
            type: cc.Label
        },

    },

    // use this for initialization
    onLoad: function () {
        // 初始化计分
        Config.KillScore = 0;
    },

    // called every frame
    update: function (dt) {
        // 每帧更新计时器，超过限度还没有生成新的星星
        this.scoreDisplay.string = 'Score: ' + Config.KillScore;
    },
});
