/*
 * @Author: super_javan 
 * @Date: 2022-04-12 22:15:43 
 * @Last Modified by: super_javan
 * @Last Modified time: 2022-04-25 16:05:33
 * @Describe :  单例模式 地图管理
 */

import BattleMapData from "../battle/BattleMapData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BattleMapManager {
    private static BattleMapManager: BattleMapManager;
    private inited: boolean = false;

    private constructor() { }

    public static getInstance(): BattleMapManager {

        if (this.BattleMapManager == null) {
            this.BattleMapManager = new BattleMapManager();
            this.BattleMapManager.init();
        }

        return BattleMapManager.BattleMapManager;
    }

    init() {
        if (this.inited) return;

        this.inited = true;
    }

    public CreateBattle(width, height, obstacleCount, obstacleGap): BattleMapData {
        let battleMapData = new BattleMapData();
        battleMapData.Generate(width, height, obstacleCount, obstacleGap);
        return battleMapData;
    }

    // update (dt) {}
}
