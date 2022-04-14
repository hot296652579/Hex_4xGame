/*
 * @Author: super_javan 
 * @Date: 2022-04-12 22:15:43 
 * @Last Modified by: super_javan
 * @Last Modified time: 2022-04-12 22:20:55
 * @Describe :  单例模式 创建战斗数据
 */

import BattleData from "./BattleData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BattleCreator {
    private static battleCreator:BattleCreator;
    private inited:boolean = false;

    private constructor(){}

    public static getInstance():BattleCreator{

        if(this.battleCreator == null){
            this.battleCreator = new BattleCreator();
            this.battleCreator.init();
        }

        return BattleCreator.battleCreator;
    }

    init(){
        if(this.inited)return;

        this.inited = true;
    }

    public CreateBattl():BattleData{
        let battleData = new BattleData();
        battleData.Generate(5,6,5,3);
        return battleData;
    }

    // update (dt) {}
}
