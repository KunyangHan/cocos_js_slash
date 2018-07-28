//假设我们在一个组件的 onLoad 方法里面添加事件处理回调，在 callback 函数中进行事件处理:

var Config = require("Config");

cc.Class({
    extends: cc.Component,

    properties: {
       button: cc.Button
    },

    onLoad: function () {
       this.button.node.on('click', this.callback, this);
    },

    callback: function (event) {
       //这里的 event 是一个 EventCustom 对象，你可以通过 event.detail 获取 Button 组件
       var button = event.detail;
       //do whatever you want with button
       Config.Pause = false;
       
       //另外，注意这种方式注册的事件，也无法传递 customEventData
    }
});