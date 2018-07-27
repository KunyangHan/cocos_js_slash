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
        // config : {
        //     default : null,
        //     type : cc._JavaScript,
        // },
        slay : {
            default : null,
            type : cc.Prefab,
        },
        canvas : {
            default : null,
            type : cc.Node,
        },
        audio: {
            url: cc.AudioClip,
            default: null
        },
        // audio : null,
        player : null,
        render : null,
        anim : null,
        frame : null,
        length : 600,
        anchorX : 960,
        anchorY : 540,
    },

    init () {
        this.player = this.canvas.getChildByName("player")
        this.render = this.player.getChildByName("render")
        this.sprite = this.render.getComponent(cc.Sprite)
        this.anim = this.render.getComponent(cc.Animation)
    },

    // world2canvas (ori) {
    //     ori.x -= this.anchorX
    //     ori.y -= this.anchorY
    //     return ori
    // },

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

    // where2Go (target) {
    //     target  = this.world2canvas(target)
    //     var ori = this.player.getPosition()
    //     var arc = Math.atan((target.y - ori.y) / (target.x - ori.x))
    //     var offsetX = Math.abs(this.length * Math.cos(arc))
    //     var offsetY = Math.abs(this.length * Math.sin(arc))
        
    //     ori.x += ori.x < target.x ? offsetX : -offsetX
    //     ori.y += ori.y < target.y ? offsetY : -offsetY
    //     return this.legalize(ori)
    // },

    // legalize(pos) {
    //     pos.x = pos.x < -this.anchorX ? -this.anchorX : pos.x
    //     pos.x = pos.x > this.anchorX ? this.anchorX : pos.x
    //     pos.y = pos.y < -this.anchorY ? -this.anchorY : pos.y
    //     pos.y = pos.y > this.anchorY ? this.anchorY : pos.y
    //     return pos
    // },

    // skill (to, len, wid) {
    //     var ori = this.player.getPosition()
    //     var ang = Math.atan((to.y - ori.y) / (to.x - ori.x)) * 180 / Math.PI
    //     var node  = cc.instantiate(this.slay)
    //     node.parent = this.player
    //     ang = to.x < ori.x ? -ang : 180 - ang;
    //     node.setRotation(ang)
    //     node.setContentSize(len, wid)
    //     node.setPosition(0, 0)
    //     var collider = node.getComponent(cc.BoxCollider)
    //     collider.offset.x = len / 2
    //     collider.offset.y = 0
    //     collider.size = new cc.size(len, wid)
    // },

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
        cc.audioEngine.play(this.audio, false, 1)
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

    // update (dt) {},
});