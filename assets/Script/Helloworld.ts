import BattleCreator from "./battle/BattleCreator";
import BattleData from "./battle/BattleData";
import BattleField from "./battle/BattleField";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    start () {
    }

    onLoad() {
        // let battleData = BattleCreator.getInstance().CreateBattl();
        // BattleField.getInstance().LoadBattleData(battleData);
    }
}
