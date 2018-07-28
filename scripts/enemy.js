var config = require("Config");
var enemyconfig = require("enemyConfig");
cc.Class({
    extends: cc.Component,
    properties: {
        // player: {
        //     default: null,
        //     type: cc.Node,
        // },
        player : null,
        speed: 60,
        enemy: {
            default: null,
            type: cc.Node,
        },
        audio: {
            url: cc.AudioClip,
            default: null
        },
        oriented: "aa",
    },
    start () {
        this.player = cc.find("Canvas/player");
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
    },
    update: function(dt){
        var anim = this.enemy.getComponent(cc.Animation);
        // var animState = anim.play('up');
        // animState.wrapMode = cc.WrapMode.Loop;
        // animState.repeatCount = Infinity;
        // var animState = anim.play('down');
        // animState.wrapMode = cc.WrapMode.Loop;
        // animState.repeatCount = Infinity;
        // var animState = anim.play('left');
        // animState.wrapMode = cc.WrapMode.Loop;
        // animState.repeatCount = Infinity;
        // var animState = anim.play('right');
        // animState.wrapMode = cc.WrapMode.Loop;
        // animState.repeatCount = Infinity;
        if(config.Pause == false){
        // if(1){
            var position = this.enemy.getPosition();
            // console.log(position.x,position.y);
            var aims = this.player.getPosition();
            // console.log(aims.x,aims.y);
            var newOriented = "up";
            if(aims.y>position.y){
                if(aims.x>position.x) (aims.y-position.y)>(aims.x-position.x) ? newOriented = "up" : newOriented = "right";
                else (aims.y-position.y)>(position.x-aims.x) ? newOriented = "up" : newOriented = "left";
            }
            else{
                if(aims.x>position.x) (position.y-aims.y)>(aims.x-position.x) ? newOriented = "down" : newOriented = "right";
                else (position.y-aims.y)>(position.x-aims.x) ? newOriented = "down" : newOriented = "left";
            }
            // console.log(this.oriented);
            
            if(newOriented != this.oriented){
                var animState = anim.play(newOriented);
                animState.wrapMode = cc.WrapMode.Loop;
                animState.repeatCount = Infinity;
                this.oriented = newOriented;
            }
            var arc = Math.atan((aims.y - position.y) / (aims.x - position.x));
            var speedX = Math.abs(this.speed * Math.cos(arc));
            var speedY = Math.abs(this.speed * Math.sin(arc));
            this.enemy.x += aims.x > position.x ? speedX / 60:-speedX / 60;
            this.enemy.y += aims.y > position.y ? speedY / 60:-speedY / 60;
        }
    },
    onLoad: function(){
        this.oriented = "aa";
    },
    onCollisionEnter: function (other, self){
        config.KillScore += 10 ;
        this.current = cc.audioEngine.play(this.audio, false, 1);
        // console.log('发生碰撞！');
        //console.log(config.KillScore);
        enemyconfig.enemyNumber--;
        this.enemy.destroy();
    },
});
