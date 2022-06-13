/*
 * @Author: super_javan 
 * @Date: 2022-06-13 14:15:14 
 * @Last Modified by: super_javan
 * @Last Modified time: 2022-06-13 15:50:53
 * 
 */

import GridUnit from "../battle/GridUnit";
import BattleUnit from "../Data/BattleUnit";


const { ccclass, property } = cc._decorator;

export enum MsgBattleHeroActionType {
    None,
    Warning,            //警告(调试用)
    EnterBattleField,   //进入战场
    ChangeTarget,       //切换目标
    MotionAction,       //移动
    SkillAction,        //使用技能
    Defeated,           //被击败
}

export class BattleAction {
    public actionType: MsgBattleHeroActionType;
    constructor(actionType: MsgBattleHeroActionType) {
        this.actionType = actionType;
    }
}

export class BattleHeroAction extends BattleAction {
    public actionUnit: BattleUnit;
    constructor(actionUnit: BattleUnit, actionType: MsgBattleHeroActionType) {
        super(actionType);
        this.actionUnit = actionUnit;
        this.actionType = actionType;
    }
}
//进入战场
export class BattleHeroEnterBattleFieldAction extends BattleHeroAction {
    public gridUnit: GridUnit;
    public attribute: BattleHeroSyncAttribute;
    constructor(actionUnit: BattleUnit) {
        super(actionUnit, MsgBattleHeroActionType.EnterBattleField);
    }

    public override toString(): String {
        return `${this.actionUnit} enter battle file ,grid-> ${this.gridUnit.toString()}`;
    }
}

export class BattleHeroSyncAttribute {
    public hpChanged;
    public currentHP;
}