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

    init () {
        this.player = this.canvas.getChildByName("player")
        this.render = this.player.getChildByName("render")
        this.sprite = this.render.getComponent(cc.Sprite)
        this.anim = this.render.getComponent(cc.Animation)
    },

    world2canvas (ori) {
        ori.x -= this.anchorX
        ori.y -= this.anchorY
        return ori
    },

    towards (target) {
        target  = this.world2canvas(target)
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

    where2Go (target) {
        target  = this.world2canvas(target)
        var ori = this.player.getPosition()
        var arc = Math.atan((target.y - ori.y) / (target.x - ori.x))
        var offsetX = Math.abs(this.length * Math.cos(arc))
        var offsetY = Math.abs(this.length * Math.sin(arc))
        
        ori.x += ori.x < target.x ? offsetX : -offsetX
        ori.y += ori.y < target.y ? offsetY : -offsetY
        return this.legalize(ori)
    },

    legalize(pos) {
        pos.x = pos.x < -this.anchorX ? -this.anchorX : pos.x
        pos.x = pos.x > this.anchorX ? this.anchorX : pos.x
        pos.y = pos.y < -this.anchorY ? -this.anchorY : pos.y
        pos.y = pos.y > this.anchorY ? this.anchorY : pos.y
        return pos
    },

    skill (to) {
        var ori = this.player.getPosition()
        var ang = Math.atan((to.y - ori.y) / (to.x - ori.x)) * 180 / Math.PI
        var node  = cc.instantiate(this.slay)
        node.parent = this.player
        ang = to.x < ori.x ? -ang : 180 - ang;
        node.setRotation(ang)
        node.setPosition(0, 0)
    },

    slaying (event) {
        var pos = this.where2Go(event.getLocation())
        var to = this.towards(event.getLocation())
        this.skill(pos)
        this.player.setPosition(pos.x, pos.y)
        cc.audioEngine.play(this.audio, false, 1)
        this.anim.play("melee_" + to)
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        this.init()
        this.canvas.on(cc.Node.EventType.MOUSE_DOWN, function(event) {
            console.log(event.getLocation())
            
            if (playerConfig.coolDown > 0)
                return
            playerConfig.unDead = playerConfig.unDeadTime
            playerConfig.coolDown = playerConfig.coolDownTime
            this.slaying(event)
        }, this)
    },

    start () {
        // cc.loader.loadRes("")
    },

    update (dt) {
        if (config.Pause)
            return
        playerConfig.coolDown -= playerConfig.coolDown > 0 ? dt : 0
        playerConfig.unDead -= playerConfig.unDead > 0 ? dt : 0
    },
});