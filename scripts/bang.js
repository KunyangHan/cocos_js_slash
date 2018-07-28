// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var PlayerConfig = require("playerConfig")

cc.Class({
    extends: cc.Component,

    properties: {
        manager : null,
        audio : {
            default : null,
            url : cc.AudioClip,
        },
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    onCollisionEnter: function (other, self) {
        if (PlayerConfig.unDead <= 0 && !PlayerConfig.dead) {
            cc.audioEngine.play(this.audio, false, 1)
            PlayerConfig.touched = true
            setTimeout(function () {
                PlayerConfig.dead = true
            }, 2000);
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.manager = cc.director.getCollisionManager()
        this.manager.enabled = true
        this.manager.enabledDebugDraw = true
    },

    start () {

    },

    // update (dt) {},
});
