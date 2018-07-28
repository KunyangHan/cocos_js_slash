var config = require("Config");
var enemyconfig = require("enemyConfig");
cc.Class({
    extends: cc.Component,
    properties: {
        player : null,
        speed: 60,
        insect: {
            default: null,
            type: cc.Node,
        },
        audio: {
            url: cc.AudioClip,
            default: null
        },
        oriented: "aa",
        storage: false,
        storageF: 0,
        Rush: {
            default: null,
            type: cc.Prefab,
        }
    },
    start () {
        this.player = cc.find("Canvas/player");
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
    },
    update: function(dt) {
        var pi = 3.141592653589793;
        var anim = this.insect.getComponent(cc.Animation);
        var newOriented = "right";
        if(config.Pause == false){
            var position = this.insect.getPosition();
            var aims = this.player.getPosition();
            var angle = 0;
            this.aimsAngle;
            var length = Math.sqrt(Math.pow((aims.x - position.x),2) + Math.pow((aims.y - position.y),2));
            if(aims.x > position.x) angle = Math.atan((aims.y - position.y) / (aims.x - position.x));
            else if(aims.y > position.y) angle = Math.atan((aims.y - position.y) / (aims.x - position.x)) + pi;
            else angle = Math.atan((aims.y - position.y) / (aims.x - position.x)) - pi;
            if(angle > (3/8)*pi&&angle < (5/8)*pi) newOriented = "up";
            else if(angle > (1/8)*pi&&angle < (3/8)*pi) newOriented = "upright";
            else if(angle > -(1/8)*pi&&angle < (1/8)*pi) newOriented = "right";
            else if(angle > -(3/8)*pi&&angle < -(1/8)*pi) newOriented = "downright";
            else if(angle > -(5/8)*pi&&angle < -(3/8)*pi) newOriented = "down";
            else if(angle > -(7/8)*pi&&angle < -(5/8)*pi) newOriented = "downleft";
            else if(angle > (7/8)*pi||angle < -(7/8)*pi) newOriented = "left";
            else if(angle > (5/8)*pi&&angle < (7/8)*pi) newOriented = "upleft";
            this.newnewori = newOriented;
            if(length < enemyconfig.insectRushLength){
                this.storage = true;
            }
            if(this.storage == false){
                if(newOriented != this.oriented){
                    var animState = anim.play("insect_"+newOriented);
                    animState.wrapMode = cc.WrapMode.Loop;
                    animState.repeatCount = Infinity;
                    this.oriented = newOriented;
                }
                var speedX = this.speed * Math.cos(angle);
                var speedY = this.speed * Math.sin(angle);
                this.insect.x += speedX / 60;
                this.insect.y += speedY / 60;
            }
            else {
                if(this.storageF == 0) {
                    this.aimsAngle = angle;
                    this.animState();
                }
                this.storageF++;
                if(this.storageF == 60) {
                    this.rush(new cc.Vec2(position.x + enemyconfig.insectRushLength * Math.cos(this.aimsAngle), position.y + enemyconfig.insectRushLength * Math.sin(this.aimsAngle)));
                    this.insect.x += enemyconfig.insectRushLength * Math.cos(this.aimsAngle);
                    this.insect.y += enemyconfig.insectRushLength * Math.sin(this.aimsAngle);
                    this.storage = false;
                    this.storageF = 0;
                }
            }
        }
    },
    animState() {
        var anim = this.insect.getComponent(cc.Animation);
        var animState = anim.play("insectStorage_"+this.newnewori);
        animState.wrapMode = cc.WrapMode.Loop;
        animState.repeatCount = Infinity;
    },
    onload: function(){
        this.oriented = "aa";
    },
    rush (to) {
        var ori = this.insect.getPosition();
        var ang = Math.atan((to.y - ori.y) / (to.x - ori.x)) * 180 / Math.PI;
        var node  = cc.instantiate(this.Rush);
        node.parent = this.insect;
        ang = to.x < ori.x ? -ang : 180 - ang;
        node.setRotation(ang);
        node.setPosition(0, 0);
    },
    onCollisionEnter: function (other, self){
        config.KillScore += 20 ;
        this.current = cc.audioEngine.play(this.audio, false, 1);
        // console.log('发生碰撞！');
        //console.log(config.KillScore);
        enemyconfig.insectNumber--;
        this.insect.destroy();
    },
});
