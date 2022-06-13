/*
 * @Author: super_javan 
 * @Date: 2022-06-13 10:24:20 
 * @Last Modified by: super_javan
 * @Last Modified time: 2022-06-13 10:39:25
 * @Describe : 战斗单位现实组件
 */

const { ccclass, property } = cc._decorator;
export enum TeamColor {
    None,
    Red,
    Blue
}

@ccclass
export default class BattleUnitRenderer extends cc.Component {

    @property(cc.Node)
    EffectNode: cc.Node = null;

    @property(cc.Label)
    labBattleInfo: cc.Label = null;

    @property(cc.Label)
    labTeam: cc.Label = null;

    @property(cc.Node)
    Color_Blue: cc.Node = null;
    @property(cc.Node)
    Color_Yellow: cc.Node = null;

    teamColor: TeamColor = TeamColor.None;

    start() {
        // this.normalGrid.active = false;
        // this.obstacleGrid.active = false;
    }

    onLoad() {

    }
}

