/*
 * @Author: super_javan 
 * @Date: 2022-06-13 10:59:20 
 * @Last Modified by: super_javan
 * @Last Modified time: 2022-06-13 12:16:18
 * 队伍数据
 */

import BattleField from "../battle/BattleField";
import BattleUnit from "./BattleUnit";

const { ccclass, property } = cc._decorator;


@ccclass
export default class BattleTeam {

    public teamID;
    public battleUnits = new Array<BattleUnit>();
    constructor() { }

    public AddBattleUnit(battleUnit: BattleUnit) {
        if (!battleUnit) return


        //重复
        if (battleUnit.battleTeam.Equals(this)) {
            console.log('战斗单位已加入队伍中...')
            return;
        }

        this.battleUnits.forEach(element => {
            if (element.battleUnitID == battleUnit.battleUnitID) {
                console.log('战斗单位已加入队伍中...');
                return;
            }
        });

        this.battleUnits.push(battleUnit);
        battleUnit.battleTeam = this;
    }

    public RemoveBattleUnit(battleUnit: BattleUnit) {
        if (battleUnit == null || !battleUnit.battleTeam.Equals(this)) {
            console.log('删除战斗单位失败!');
            return;
        }

        for (let index = 0; index < this.battleUnits.length; index++) {
            const element = this.battleUnits[index];
            if (element.battleUnitID == battleUnit.battleUnitID) {
                this.battleUnits.splice(index, 1);
                battleUnit.battleTeam = null;
            }
        }
    }

    public Equals(object: Object): boolean {
        if (object instanceof BattleTeam) {
            return this.teamID == (object as BattleTeam).teamID;
        }
        return false;
    }
}
