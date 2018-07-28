cc.Class({
    extends: cc.Component,
    properties: {
        ball: {
            default: null,
            type: cc.Node,
        },
        
    },
    start () {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
    },
    onCollisionEnter: function (other, self){
        //this.current = cc.audioEngine.play(this.audio, false, 1);
        this.ball.destroy();
    },


});
