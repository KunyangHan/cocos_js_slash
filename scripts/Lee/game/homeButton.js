// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var pc = require("playerConfig")
var c = require("Config")
var mc = require("EnemyConfig")

cc.Class({
    extends: cc.Component,

    properties: {
       button: cc.Button
    },

    onLoad: function () {
       this.button.node.on('click', this.callback, this);
    },

    callback: function (event) {
        c.Pause = false
        c.KillScore = 0
        pc.dead = false
        pc.touched = false
        cc.director.loadScene("hall")
        mc.enemyNumber = 0
        mc.insectNumber = 0
        mc.goatNum = 0
        mc.witchNumber = 0
    }
});
