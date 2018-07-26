var config = require("Config");

cc.Class({
  extends: cc.Component,
  properties: {
    target: {
      default: null,
      type: cc.Prefab
    },
    fn: 0, //统计过了多少帧。
    en: 0, //统计敌人数量。
    player: {
      default: null,
      type: cc.Node
    }
  },
  start: function() {},
  update: function(dt) {
    if (config.Pause == false) {
      // if(1){
      if (this.fn > 100 && this.en - config.KillScore / 10 < 20) {
        var x = 0;
        var y = 0;
        //var coordinate=this.player.getPosition();
        x = 950 * cc.randomMinus1To1();
        y = 500 * cc.randomMinus1To1();
        var n = this.en % 3;
        var scene = cc.director.getScene().getChildByName("Canvas");
        var node = cc.instantiate(this.target);
        node.parent = scene;
        switch (n) {
          case 0:
            node.setPosition(-950, y);
            break;
          case 1:
            node.setPosition(x, 500);
            break;
          case 2:
            node.setPosition(950, y);
            break;
          default:
            break;
        }
        this.en++;
        this.fn = 0;
      }
      this.fn++;
    }
  }
});
