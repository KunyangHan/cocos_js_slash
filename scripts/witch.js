var config = require("Config");
var enemyconfig = require("enemyConfig");
cc.Class({
    extends: cc.Component,
    properties: {
        player : null,
        speed: 60,
        witch: {
            default: null,
            type: cc.Node,
        },
        audio: {
            url: cc.AudioClip,
            default: null
        },
        ball: {
            default: null,
            type: cc.Prefab,
        },
        oriented: "aa",
        storage: false,
        storageF: 0,
    },
    update: function(dt){
        var pi = 3.141592653589793;
        var anim = this.witch.getComponent(cc.Animation);
        var newOriented = "Right";
        if(config.Pause == false){
            var position = this.witch.getPosition();
            var aims = this.player.getPosition();
            var angle = 0;
            this.aimsAngle;
            var length = Math.sqrt(Math.pow((aims.x - position.x),2) + Math.pow((aims.y - position.y),2));
            if(aims.x > position.x) angle = Math.atan((aims.y - position.y) / (aims.x - position.x));
            else if(aims.y > position.y) angle = Math.atan((aims.y - position.y) / (aims.x - position.x)) + pi;
            else angle = Math.atan((aims.y - position.y) / (aims.x - position.x)) - pi;
            if(angle > (3/8)*pi&&angle < (5/8)*pi) newOriented = "Up";
            else if(angle > (1/8)*pi&&angle < (3/8)*pi) newOriented = "Upright";
            else if(angle > -(1/8)*pi&&angle < (1/8)*pi) newOriented = "Right";
            else if(angle > -(3/8)*pi&&angle < -(1/8)*pi) newOriented = "Downright";
            else if(angle > -(5/8)*pi&&angle < -(3/8)*pi) newOriented = "Down";
            else if(angle > -(7/8)*pi&&angle < -(5/8)*pi) newOriented = "Downleft";
            else if(angle > (7/8)*pi||angle < -(7/8)*pi) newOriented = "Left";
            else if(angle > (5/8)*pi&&angle < (7/8)*pi) newOriented = "Upleft";
            this.newnewori = newOriented;
            if(length < enemyconfig.witchLength){
                this.storage = true;
            }
            if(this.storage == false){
                if(newOriented != this.oriented){
                    var animState = anim.play("witch_"+newOriented);
                    animState.wrapMode = cc.WrapMode.Loop;
                    animState.repeatCount = Infinity;
                    this.oriented = newOriented;
                }
                var speedX = this.speed * Math.cos(angle);
                var speedY = this.speed * Math.sin(angle);
                this.witch.x += speedX / 60;
                this.witch.y += speedY / 60;
            }
            else {
                if(this.storageF == 0) {
                    this.aimsAngle = angle;
                    this.animState();
                }
                this.storageF++;
                if(this.storageF == 60) {
                    //this.cast(new cc.Vec2(position.x + enemyconfig.witchLength * Math.cos(this.aimsAngle), position.y + enemyconfig.witchLength * Math.sin(this.aimsAngle)));
                    this.cast(this.aimsAngle);
                    this.storage = false;
                    this.storageF = 0;
                }
            }
        }
    },
    animState() {
        var anim = this.witch.getComponent(cc.Animation);
        var animState = anim.play("witchCast_"+this.newnewori);
        animState.wrapMode = cc.WrapMode.Loop;
        animState.repeatCount = Infinity;
    },
    cast (ang) {
        var node  = cc.instantiate(this.ball);
        node.parent = this.witch;
        node.setPosition(0, 0);
        var action = cc.moveTo(5, 1000 * Math.cos(ang), 1000 * Math.sin(ang));
        node.runAction(action);
        //node.destroy();
        setTimeout(function () {
            node.destroy();
          }.bind(this), 4000);
    },
    start () {
        this.player = cc.find("Canvas/player");
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
    },
    onCollisionEnter: function (other, self){
        config.KillScore += 20 ;
        this.current = cc.audioEngine.play(this.audio, false, 1);
        enemyconfig.witchNumber--;
        this.witch.destroy();
    },

});
