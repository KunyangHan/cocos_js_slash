//假设我们在一个组件的 onLoad 方法里面添加事件处理回调，在 callback 函数中进行事件处理:

var pc = require("playerConfig")
var c = require("Config")

cc.Class({
    extends: cc.Component,

    properties: {
    //    button : {
    //     default : null,
    //     type : cc.Button
    //    }
    },

    onLoad: function () {
        cc.find("Canvas/play").getComponent(cc.Button).node.on('click', function (event) {
            cc.director.loadScene('game');
        })
        // this.button.node.on('click', this.callback, this);
        
    },

    // callback: function (event) {
    //    //这里的 event 是一个 EventCustom 对象，你可以通过 event.detail 获取 Button 组件
    //    var button = event.detail;
    //    //do whatever you want with button
    //    cc.director.loadSence('game');
       
    //    //另外，注意这种方式注册的事件，也无法传递 customEventData
    // }
    update () {
        c.Pause = false
        c.KillScore = 0
        pc.dead = false
        pc.touched = false
    }
});