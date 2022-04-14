/*
 * @Author: super_javan 
 * @Date: 2022-04-13 16:42:36 
 * @Last Modified by: super_javan
 * @Last Modified time: 2022-04-13 18:39:53
 * Describe : 战斗显示对象
 */

import BattleCreator from "./BattleCreator";
import BattleData from "./BattleData";
import GridUnit from "./GridUnit";


const {ccclass, property} = cc._decorator;

@ccclass
export default class BattleField extends cc.Component {

    @property(cc.Node)
    gridUnitsRoot: cc.Node = null;

    @property(cc.Prefab)
    gridUnitModel:cc.Prefab = null;

    currentData:BattleData;
    //挂地图上的格子
    public gridUnits:Array<Array<GridUnit>>;
    
    public gridPool:Array<GridUnit>;
    static battleField: BattleField;

    onLoad() {
        // console.log(this.gridUnitModel);    
        let battleData = BattleCreator.getInstance().CreateBattl();
        this.LoadBattleData(battleData);
    }

    public static getInstance():BattleField{

        if(this.battleField == null){
            this.battleField = new BattleField();
        }

        return BattleField.battleField;
    }

    public LoadBattleData(battleData:BattleData){
        if(battleData != null){
            this.UnloadBattleData();
        }

        this.currentData = battleData;
        this.PrepareBattleMap();
    }

    private PrepareBattleMap(){
        let self = this;
        if(this.currentData == null){
            console.log('地图出错 战斗数据没有!');
        }

        let currentData = this.currentData;
        this.gridUnits = new Array<Array<GridUnit>>();
        // this.gridUnits[currentData.mapWith][currentData.mapHeight];
        for (let i = 0; i < currentData.mapWith; i++) {
            this.gridUnits.push(new Array<GridUnit>());
        }
        for (let i = 0; i < currentData.mapWith; i++) {
            for (let j = 0; j < currentData.mapHeight; j++) {
                this.gridUnits[i].push(new GridUnit);
            }   
        }

        for (let row = 0; row < currentData.mapHeight; row++) {
            for (let col = 0; col < currentData.mapWith; col++) {
                let gud = currentData.mapGrids[col][row];
                if(gud != null){
                    let gu = self.CreateGrid();
                    if(gu){
                        self.gridUnits[col][row] = gu.getComponent(GridUnit);
                        gu.getComponent(GridUnit).node.setPosition(gud.localPosition);
                        gu.getComponent(GridUnit).gridData = gud;
                        gu.getComponent(GridUnit).Refresh();
                    }
                }
            }
        }
    }

    private CreateGrid(){
        if(this.gridPool == null){
            this.gridPool = new Array<GridUnit>();
        }

        for (let index = 0; index < this.gridPool.length; index++) {
            if(!this.gridPool[index].node.active){
                return this.gridPool[index];
            }
        }

        let gu = cc.instantiate(this.gridUnitModel);
        gu.parent = this.gridUnitsRoot;
        gu.setPosition(0,0);
        this.gridPool.push(gu.getComponent(GridUnit));
        return gu;
    }

    private UnloadBattleData(){

    }

    // update (dt) {}
}
