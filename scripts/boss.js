// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html


var config = require("Config")

cc.Class({
    extends: cc.Component,

    properties: {
        up : cc.SpriteFrame,
        left : cc.SpriteFrame,
        right : cc.SpriteFrame,
        down : cc.SpriteFrame,
        upleft : cc.SpriteFrame,
        upright : cc.SpriteFrame,
        downleft : cc.SpriteFrame,
        downright : cc.SpriteFrame,
        hp : 5,
        anim : null,
        moan : cc.AudioClip,
        hint : cc.AudioClip,
        laugh : cc.AudioClip,
        player : null,
        sprite : null,
        walkLength : 100,
        isSkill : false,
        skillLength : 300,
        skillCoolDown : 2,
        skillCoolDownTime : 5,
        dashTime : 3,
        littleSkillCoolDown : 0,
        littleSkillCoolDownTime : 1,
    },

    calArc (aims, position) {
        var arc = 0
        if(aims.x > position.x) arc = Math.atan((aims.y - position.y) / (aims.x - position.x))
        else if(aims.y > position.y) arc = Math.atan((aims.y - position.y) / (aims.x - position.x)) + Math.PI
        else arc = Math.atan((aims.y - position.y) / (aims.x - position.x)) - Math.PI
        
        return arc
    },

    arc2Ang (arc) {
        return arc * 180 / Math.PI
    },

    faceWhere (angle) {
        if (angle > 45 && angle <= 135) return "up"
        else if (angle > 135 || angle <= -135) return "left"
        else if (angle > -135 && angle <= -45) return "down"
        else return "right"
    },

    playerward (angle) {
        if(angle > 67.5 && angle <= 112.5) this.sprite.spriteFrame = this.up
        else if(angle > 22.5 && angle <= 67.5) this.sprite.spriteFrame = this.upright
        else if(angle > -22.5 && angle <= 22.5) this.sprite.spriteFrame = this.right
        else if(angle > -67.5 && angle <= -22.5) this.sprite.spriteFrame = this.downright
        else if(angle > -112.5 && angle <= -67.5) this.sprite.spriteFrame = this.down
        else if(angle > -157.5 && angle <= -112.5) this.sprite.spriteFrame = this.downleft
        else if(angle > 157.5 || angle <= -157.5) this.sprite.spriteFrame = this.left
        else if(angle > 112.5 && angle <= 157.5) this.sprite.spriteFrame = this.upleft
    },

    isRealNum (val) {
        if(val === "" || val ==null){
            return false;
        }
        if(!isNaN(val)){
            return true;
        }else{
            return false;
        }
    },

    walk (arc, dealtT) {
        var offsetX = this.walkLength * Math.cos(arc) * dealtT
        var offsetY = this.walkLength * Math.sin(arc) * dealtT
        if (this.isRealNum(offsetX) && this.isRealNum(offsetY)) {
            this.node.setPosition(this.node.x + offsetX, this.node.y + offsetY)
        }
    },
    
    triDash () {
        if (this.littleSkillCoolDown > 0)
            return
        if (this.dashTime == 4){
            cc.audioEngine.play(this.laugh, false, 1)
        }
        else if (this.dashTime > 0) {
            var arc = this.calArc(this.player.getPosition(), this.node.getPosition())
            this.anim.play("boss_dash_" + this.faceWhere(this.arc2Ang(arc)))
            cc.audioEngine.play(this.hint, false, 1)
            this.node.runAction(cc.moveBy(0.5, this.skillLength * Math.cos(arc), this.skillLength * Math.sin(arc)))
        }
        else {
            this.dashTime = 5
            this.skillCoolDown = this.skillCoolDownTime
            this.isSkill = false
        }
        this.littleSkillCoolDown = this.littleSkillCoolDownTime
        this.dashTime--
    },

    onCollisionEnter: function (other, self){
        this.hp--
        if (this.hp == 0) {
            config.KillScore += 100 
            this.current = cc.audioEngine.play(this.moan, false, 1)
            this.anim.play("boss_dead")
            this.getComponent(cc.BoxCollider).destroy()
            setTimeout(function () {
                cc.find("Canvas/boss").destroy()
            }, 5000)
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.player = cc.find("Canvas/player")
        this.sprite = this.getComponent(cc.Sprite)
        this.anim = this.getComponent(cc.Animation)
    },

    update (dt) {
        if (config.Pause || this.hp <= 0)
            return
        if (this.isSkill || this.skillCoolDown <= 0) {
            this.isSkill = true
            this.triDash()
        }
        else if (!this.isSkill) {
            var arc = this.calArc(this.player.getPosition(), this.node.getPosition())
            this.playerward(this.arc2Ang(arc))
            this.walk(arc, dt)
        }
        this.skillCoolDown -= this.skillCoolDown > 0 ? dt : 0
        this.littleSkillCoolDown -= this.littleSkillCoolDown > 0 ? dt : 0
    },
});
