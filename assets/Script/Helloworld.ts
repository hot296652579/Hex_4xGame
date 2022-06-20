import BattleCreator from "./battle/BattleCreator";
import BattleData from "./battle/BattleData";
import BattleFieldRenderer from "./battle/BattleFieldRenderer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {
    @property(cc.Node)
    testNode: cc.Node = null;

    start() {
    }

    onLoad() {
        let self = this
        // let battleData = BattleCreator.getInstance().CreateBattl();
        // BattleFieldRenderer.getInstance().LoadBattleData(battleData);

        // let testSpNode = this.testNode.getChildByName('testSp');
        // let imgPath = 'battle/img/Tiles/Medieval/medieval_cabin';
        // let component = null;
        // let loadCallBack = function (err, res) {
        //     component = testSpNode.getComponent(cc.Sprite);
        //     component.spriteFrame = res;
        // }

        // cc.resources.load(imgPath, cc.SpriteFrame, loadCallBack);
    }
}
