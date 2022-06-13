/*
 * @Author: super_javan 
 * @Date: 2022-06-13 10:52:16 
 * @Last Modified by: super_javan
 * @Last Modified time: 2022-06-13 16:04:50
  * @Describe : 战斗单位数据 
 */

import BattleField from "../battle/BattleField";
import GridUnit from "../battle/GridUnit";
import BattleUnitRenderer from "../DataRenderer/BattleUnitRenderer";
import { BattleHeroEnterBattleFieldAction, BattleHeroSyncAttribute } from "../Msg/GameMsg";
import BattleTeam from "./BattleTeam";

const { ccclass, property } = cc._decorator;

export enum TargetSearchResult {
    NeedMove,  //有目标需要移动
    InRange,   //攻击范围内
    Inexistence  //没有目标
}

export enum HeroActionState {
    Normal,                  //正常
    WaitForPlayerChoose,     //等待玩家操作
    BattleEnd,               //战斗结束
    Error,                   //错误
    Warn,                    //警告(测试用)
}

@ccclass
export default class BattleUnit {

    public battleUnitID;
    public hp;
    public maxHp;
    public atk;
    public mobility;//每次行动范围

    public battleField: BattleField;
    public battleTeam: BattleTeam;
    public enemyTeam: BattleTeam;

    //目标单位
    targetBattleUnit: BattleUnit;
    //所在格子
    mapGrid: GridUnit;
    //目标格子
    targetGrid: GridUnit;
    //移动路径
    toTagetPath = new Array<GridUnit>();

    public battleUnitRenderer: BattleUnitRenderer;

    constructor() { }

    public EnterBattleField(battleField: BattleField, bornGrid: GridUnit, generateAction): BattleHeroEnterBattleFieldAction {
        if (battleField && bornGrid) {
            this.battleField = battleField;
            this.EnterGrid(bornGrid);
        }

        if (generateAction) {
            let action = new BattleHeroEnterBattleFieldAction(this);
            action.gridUnit = bornGrid;
            action.attribute = new BattleHeroSyncAttribute();
            action.attribute.hpChanged = 0;
            action.attribute.currentHP = this.hp;
            return action;
        }
        return null;
    }
    //进入格子
    EnterGrid(grid: GridUnit) {
        if (grid) {
            if (this.mapGrid != null) {
                this.LeaveGrid();
            }

            this.mapGrid = grid;
            grid.onEnter(this);
        } else {
            console.log('enter grid failed,grid is null');
        }
    }
    //离开格子
    LeaveGrid() {
        if (this.mapGrid != null) {
            this.mapGrid.onLeave();
            this.mapGrid = null;
        }
    }
}
