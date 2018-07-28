// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
 
var confp = require("playerConfig");
var conf = require("Config");

cc.Class({
    extends: cc.Component,

    properties: {
        // opacity : {
        //     default : null,
        //     type : cc.Node
        // }

    },



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.node.x = 3000;
        // var opacity = cc.find("Canvas/opacity")
    },

    update (dt) {
        if(confp.dead){
            // console.log(confp.dead);
            conf.Pause = true;            
            // opacity.Opacity = 150,
            cc.find("finalScore/score").getComponent(cc.Label).string = conf.KillScore
            // this.node.getChildByName("score").string = conf.KillScore;
            // console.log(conf.KillScore);
            this.show();
        }
    },

    show () {
        this.node.setPosition(886, 1545);
    },
});
