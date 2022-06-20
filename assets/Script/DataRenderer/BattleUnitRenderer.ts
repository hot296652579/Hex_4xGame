/*
 * @Author: super_javan 
 * @Date: 2022-06-13 10:24:20 
 * @Last Modified by: super_javan
 * @Last Modified time: 2022-06-13 10:39:25
 * @Describe : 战斗单位现实组件
 */

import GridUnit from "../battle/GridUnit";
import BattleUnit from "../Data/BattleUnit";
import { BattleHeroAction, BattleHeroEnterBattleFieldRendererAction, MsgBattleHeroActionType } from "../Msg/GameMsg";

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

    playEnterBattleFieldRenderer = null;

    //关联的战斗单位数据
    public battleUnit: BattleUnit;

    start() {
        // this.normalGrid.active = false;
        // this.obstacleGrid.active = false;
    }

    onLoad() {

    }

    RefreshFigure() {

    }

    OnConnect(battleUnit: BattleUnit) {
        this.battleUnit = battleUnit;
        if (battleUnit != null) {
            this.node.name = battleUnit.ToString();
            this.labBattleInfo.string = `teamID:${battleUnit.battleTeam.teamID}_UnitID:${battleUnit.battleUnitID}`;
            this.node.active = true;
        }
    }

    OnDisconnect() {
        this.battleUnit = null;
        this.teamColor = TeamColor.None;
        this.node.active = false;
    }

    public RunHeroAction(heroAction: BattleHeroAction) {
        switch (heroAction.actionType) {
            case MsgBattleHeroActionType.EnterBattleFieldRenderer:
                this.playEnterBattleFieldRenderer = this.PlayEnterBattleFieldRendererAction(heroAction as BattleHeroEnterBattleFieldRendererAction);
                this.runGenerator(this.playEnterBattleFieldRenderer);
                break;

            default:
                break;
        }
    }

    runGenerator(gen) {
        let v = gen.next();
        if (v.value == 'PlayEnterBattleFieldRendererAction') {
            this.runGenerator(this.playEnterBattleFieldRenderer)
        }
    }

    //进入战场
    * PlayEnterBattleFieldRendererAction(heroAction: BattleHeroEnterBattleFieldRendererAction) {
        if (heroAction == null) {
            console.log('heroAction enterBattleFieldRenderer action is null...');
            return;
        }

        let self = this;
        yield this.UpdatePositionByGrid(heroAction.gridUnit);
    }

    public UpdatePositionByGrid(gridUnit: GridUnit) {
        if (gridUnit != null) {
            let OrderIncrease_BattleUnit = 2;
            let OrderGapPerRow = 10;
            this.node.setPosition(gridUnit.gridData.localPosition);
            this.node.zIndex = gridUnit.gridData.row * OrderGapPerRow + OrderIncrease_BattleUnit;
        }
    }
}

