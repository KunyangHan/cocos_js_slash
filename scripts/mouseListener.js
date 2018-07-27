// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html


cc.Class({
    extends: cc.Component,

    properties: {
        canvas: {
            default : null,
            type : cc.Node,
        },
        player: {
            default : null,
            type : cc.Node,
        },
        slay: null,
        detail : null,
        on : false,
        timeStart : null,
    },

    dispatch (event, rel) {
        this.detail.time = this.on ? new Date().getTime() - this.timeStart : 0
        this.detail.pos = new cc.Vec2(event.getLocation().x, event.getLocation().y)
        this.detail.release = rel
        this.slay.setUserData(this.detail)
        this.node.dispatchEvent(this.slay)
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.detail = new Object()
        this.slay = new cc.Event.EventCustom('slay', true)
        this.canvas.on(cc.Node.EventType.MOUSE_DOWN, function(event) {
            this.timeStart = new Date().getTime()
            this.on = true
            
            this.dispatch(event, false)
        }, this)
        this.canvas.on(cc.Node.EventType.MOUSE_MOVE, function(event) {
            if (!this.on)
                return
            this.dispatch(event, false)
        }, this)
        this.canvas.on(cc.Node.EventType.MOUSE_UP, function(event) {
            this.dispatch(event, true)
            this.on = false
        }, this)
    },

    // update (dt) {},
});
