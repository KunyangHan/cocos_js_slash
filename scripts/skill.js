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
        instructor : {
            default : null,
            type : cc.Node,
        },
        slay : {
            default : null,
            type : cc.Prefab,
        },
        audio: {
            url: cc.AudioClip,
            default: null
        },
        player : {
            default : null,
            type : cc.Node,
        },
        line : null,
        move : null,
        calLength : null,
        posStart : null,
        timeStart : null,
        targetPos : null,
        length : null,
        anchorX : 960,
        anchorY : 540,
    },
    
    canvas2world (ori) {
        ori.x += this.anchorX
        ori.y += this.anchorY
        return ori
    },
    
    legalize(pos) {
        pos.x = pos.x < -this.anchorX ? -this.anchorX : pos.x
        pos.x = pos.x > this.anchorX ? this.anchorX : pos.x
        pos.y = pos.y < -this.anchorY ? -this.anchorY : pos.y
        pos.y = pos.y > this.anchorY ? this.anchorY : pos.y
        return pos
    },

    where2Go (target) {
        var ori = this.player.getPosition()
        var arc = Math.atan((target.y - this.posStart.y) / (target.x - this.posStart.x))
        var offsetX = Math.abs(this.calLength * Math.cos(arc))
        var offsetY = Math.abs(this.calLength * Math.sin(arc))
        
        ori.x += this.posStart.x < target.x ? offsetX : -offsetX
        ori.y += this.posStart.y < target.y ? offsetY : -offsetY
        return this.legalize(ori)
    },

    time2Length (time) {
        if (time < 500)
            this.calLength = 600 + 0.4 * time
        else if (time < 1500)
            this.calLength = 800 + 0.2 * time
        else 
            this.calLength = 1000
    },

    calLen (player, target) {
        var deX = player.x - target.x
        var deY = player.y - target.y
        return Math.sqrt(deX * deX + deY * deY)
    },

    fixData (pos) {
        var playerPos = this.player.getPosition()
        this.targetPos = this.where2Go(pos)
        this.length = this.calLen(playerPos, this.targetPos)
    },

    skill (to, len, wid) {
        var ori = this.player.getPosition()
        var ang = Math.atan((to.y - ori.y) / (to.x - ori.x)) * 180 / Math.PI
        var node  = cc.instantiate(this.slay)
        node.parent = this.player
        ang = to.x < ori.x ? -ang : 180 - ang
        // node.getComponent(cc._Script).say('ssssss')
        node.setRotation(ang)
        node.setContentSize(len, wid)
        node.setPosition(0, 0)
        var collider = node.getComponent(cc.BoxCollider)
        collider.offset.x = len / 2
        collider.offset.y = 0
        collider.size = new cc.size(len, wid)
        cc.audioEngine.play(this.audio, false, 1)
    },

    modeCheck (pos) {
        if (Math.abs(pos.x - this.posStart.x) < 50 && Math.abs(pos.y - this.posStart.y) < 50) {
            this.posStart = this.canvas2world(this.player.getPosition())
        }
    },

    release (detail) {
        if (playerConfig.coolDown > 0 || config.Pause)
            return
        this.modeCheck(detail.pos)

        playerConfig.unDead = playerConfig.unDeadTime
        playerConfig.coolDown = playerConfig.coolDownTime
        this.time2Length(detail.time)
        this.fixData(detail.pos)
        this.move.setUserData(this.targetPos)
        this.skill(this.targetPos, this.length, 50)
        this.node.dispatchEvent(this.move)
        
        this.instructor.setOpacity(0)
        this.timeStart = -1
    },

    instruct (detail) {
        if (detail.time == 0){
            this.posStart = detail.pos
            this.timeStart = new Date().getTime()
        }
        // console.log("pos :" + detail.pos)
        if (detail.time < 100)
            return
        this.instructor.setOpacity(255)
        this.time2Length(detail.time)
        this.fixData(detail.pos)
        var ori = this.player.getPosition()
        var ang = Math.atan((this.targetPos.y - ori.y) / (this.targetPos.x - ori.x)) * 180 / Math.PI
        ang = this.targetPos.x < ori.x ? -ang : 180 - ang;
        this.instructor.setRotation(ang - 90)
        this.line.setContentSize(this.length, 3)
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.timeStart = -1
        this.move = new cc.Event.EventCustom('move', true)
        this.line = this.instructor.getChildByName('line')
        this.node.on('slay', function(event) {
            if (event.detail.release == true){
                this.release(event.getUserData())
            }
            else{
                this.instruct(event.getUserData())
                // event.stopPropagation()
            }
        }, this)
    },

    update (dt) {
        if (config.Pause)
            return
        playerConfig.coolDown -= playerConfig.coolDown > 0 ? dt : 0
        playerConfig.unDead -= playerConfig.unDead > 0 ? dt : 0
        if (this.timeStart >= 0) {
            this.time2Length(new Date().getTime() - this.timeStart)
            this.line.setContentSize(this.calLength, 3)
        }
    },
});
