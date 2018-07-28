var config = require("Config");
var enemyConfig = require("enemyConfig");
cc.Class({
    extends: cc.Component,
    properties: {
        enemy: {
            default: null,
            type: cc.Prefab
        },
        insect: {
            default: null,
            type: cc.Prefab
        },
        goat: {
            default: null,
            type: cc.Prefab
        },
        fn: 0, //统计过了多少帧。
        enemyF: 0,
        insectF: 0,
        witchF: 0,
        player: {
            default: null,
            type: cc.Node
        },
        witch: {
            default: null,
            type: cc.Prefab
        },
    },
    // start: function () { },
    update: function (dt) {
        if (config.Pause == false) {
            if (config.KillScore / 500 > enemyConfig.goatNum + 1) {
                console.log(config.KillScore / 500)
                
                enemyConfig.goatNum++
                var scene = cc.director.getScene().getChildByName("Canvas");
                var node = cc.instantiate(this.goat)
                node.parent = scene
                node.setPosition(this.player.getPosition().x, this.player.getPosition().y + 500)
            }
            if (this.enemyF > 100 && enemyConfig.enemyNumber < 20) {
                var x = 0;
                var y = 0;
                //var coordinate=this.player.getPosition();
                x = 950 * cc.randomMinus1To1();
                y = 500 * cc.randomMinus1To1();
                var scene = cc.director.getScene().getChildByName("Canvas");
                var node = cc.instantiate(this.enemy);
                node.parent = scene;
                switch (config.KillScore % 3) {
                    case 0:
                        node.setPosition(-950, y);
                        break;
                    case 1:
                        node.setPosition(x, 500);
                        break;
                    case 2:
                        node.setPosition(950, y);
                        break;
                    default: node.setPosition(950, y);
                        break;
                }
                enemyConfig.enemyNumber++;
                this.enemyF = 0;
            }
            this.enemyF++;
            this.fn++;
            if (this.insectF > 100 && enemyConfig.insectNumber < 20) {
                var x = 0;
                var y = 0;
                x = 950 * cc.randomMinus1To1();
                y = 500 * cc.randomMinus1To1();
                var scene = cc.director.getScene().getChildByName("Canvas");
                var node = cc.instantiate(this.insect);
                node.parent = scene;
                switch (config.KillScore % 3) {
                    case 0:
                        node.setPosition(-950, y);
                        break;
                    case 1:
                        node.setPosition(x, 500);
                        break;
                    case 2:
                        node.setPosition(950, y);
                        break;
                    default: node.setPosition(950, y);
                        break;
                }
                enemyConfig.insectNumber++;
                this.insectF = 0;
            }
            this.insectF++;
            if (this.witchF > 150 && enemyConfig.witchNumber < 20) {
                var x = 0;
                var y = 0;
                x = 950 * cc.randomMinus1To1();
                y = 500 * cc.randomMinus1To1();
                var scene = cc.director.getScene().getChildByName("Canvas");
                var node = cc.instantiate(this.witch);
                node.parent = scene;
                switch (config.KillScore % 3) {
                    case 0:
                        node.setPosition(-950, y);
                        break;
                    case 1:
                        node.setPosition(x, 500);
                        break;
                    case 2:
                        node.setPosition(950, y);
                        break;
                    default: node.setPosition(950, y);
                        break;
                }
                enemyConfig.witchNumber++;
                this.witchF = 0;
            }
            this.witchF++;
        }
    }
});
