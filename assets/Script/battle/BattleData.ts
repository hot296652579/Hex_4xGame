/*
 * @Author: super_javan 
 * @Date: 2022-04-12 22:17:59 
 * @Last Modified by: super_javan
 * @Last Modified time: 2022-04-25 16:05:29
 * @Describe : 战斗数据模块
 */

import BattleMapManager from "../Manager/BattleMapManager";
import BattleMapData from "./BattleMapData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BattleData {
    public mapData: BattleMapData;
    constructor() { }

    public Generate(width, height, obstacleCount, gap, battleUnitCount) {
        this.GenerateMap(width, height, obstacleCount, gap);
    }

    private GenerateMap(width, height, obstacleCount, gap) {
        this.mapData = BattleMapManager.getInstance().CreateBattle(width, height, obstacleCount, gap);
    }
}
