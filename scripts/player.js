// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var playerConfig = require("playerConfig")
var config = require("Config")

cc.Class({
    extends: cc.Component,

    properties: {
        canvas : {
            default : null,
            type : cc.Node,
        },
        // audio : null,
        player : null,
        render : null,
        anim : null,
        frame : null,
        alive : true,
        length : 600,
        anchorX : 960,
        anchorY : 540,
    },

    init () {
        this.alive = true
        this.player = this.canvas.getChildByName("player")
        this.render = this.player.getChildByName("render")
        this.sprite = this.render.getComponent(cc.Sprite)
        this.anim = this.render.getComponent(cc.Animation)
    },

    towards (target) {
        // target  = this.world2canvas(target)
        var ori = this.player.getPosition()
        var dealtY = target.y - ori.y
        var dealtX = target.x - ori.x
        if (Math.abs(dealtX) > Math.abs(dealtY)) {
            return dealtX > 0 ? "right" : "left"
        }
        else {
            return dealtY > 0 ? "up" : "down"
        }
    },

    adjustPos (to) {
        var x = 13
        switch (to) {
            case 'left':
            case 'down':
                x = 13
                break
            case 'up':
                x = 42
                break
            case 'right':
                x = 57
                break
        }
        this.render.setPosition(x, 0)
    },

    slaying (pos) {
        this.length = 400
        var to = this.towards(pos)
        this.anim.play("sword_melee_" + to)
        this.adjustPos(to)
        // console.log(pos);
        
        this.player.setPosition(pos.x, pos.y)
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        this.init()
        this.node.on('move', function(event) {
            this.slaying(event.detail)
        }, this)
    },

    start () {
        // cc.loader.loadRes("")
    },

    update (dt) {
        if (playerConfig.touched && this.alive){
            this.anim.play('player_dead')
            this.alive = false
        }
    },
});