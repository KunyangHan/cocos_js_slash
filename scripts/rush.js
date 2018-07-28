
cc.Class({
    extends: cc.Component,

    properties: {
        target : cc.Node,
    },
    start () {
        this.target.runAction(cc.fadeOut(0.2))
        setTimeout(function () {
            this.target.destroy();
          }.bind(this), 200);
    },

});
