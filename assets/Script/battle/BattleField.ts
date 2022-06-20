/*
 * @Author: super_javan 
 * @Date: 2022-04-13 16:42:36 
 * @Last Modified by: super_javan
 * @Last Modified time: 2022-04-25 16:05:59
 * Describe : 战斗显示对象
 */

import BattleCreator from "./BattleCreator";
import BattleData from "./BattleData";
import GridUnit, { GridRanderType } from "./GridUnit";
import GridUnitData, { GridType } from "./GridUnitData";
import MapNavigator from "./MapNavigator";


const { ccclass, property } = cc._decorator;

@ccclass
export default class BattleFieldRenderer extends cc.Component {

    @property(cc.Node)
    gridUnitsRoot: cc.Node = null;

    @property(cc.Prefab)
    gridUnitModel: cc.Prefab = null;

    private from = null;
    private to = null;
    private path: Array<GridUnitData>;
    private searched: Array<GridUnitData>;

    currentData: BattleData;
    //挂地图上的格子
    public gridUnits: Array<Array<GridUnit>>;

    public gridPool: Array<GridUnit>;
    static BattleFieldRenderer: BattleFieldRenderer;

    onLoad() {
        // console.log(this.gridUnitModel);    
        let battleData = BattleCreator.getInstance().CreateBattl();
        this.LoadBattleData(battleData);

        this.path = new Array<GridUnitData>();
        this.searched = new Array<GridUnitData>();
    }

    public static getInstance(): BattleFieldRenderer {

        if (this.BattleFieldRenderer == null) {
            this.BattleFieldRenderer = new BattleFieldRenderer();
        }

        return BattleFieldRenderer.BattleFieldRenderer;
    }

    public LoadBattleData(battleData: BattleData) {
        if (battleData != null) {
            this.UnloadBattleData();
        }

        this.currentData = battleData;
        this.PrepareBattleMap();
    }

    private PrepareBattleMap() {
        let self = this;
        if (this.currentData == null) {
            console.log('地图出错 战斗数据没有!');
        }

        let currentData = this.currentData;
        this.gridUnits = new Array<Array<GridUnit>>();
        for (let i = 0; i < currentData.mapData.mapHeight; i++) {
            this.gridUnits.push(new Array<GridUnit>());
        }
        for (let i = 0; i < currentData.mapData.mapHeight; i++) {
            for (let j = 0; j < currentData.mapData.mapWidth; j++) {
                this.gridUnits[i].push(new GridUnit);
            }
        }

        for (let row = 0; row < currentData.mapData.mapHeight; row++) {
            for (let col = 0; col < currentData.mapData.mapWidth; col++) {
                let gud = currentData.mapData.mapGrids[row][col];
                if (gud != null) {
                    let gu = self.CreateGrid();
                    if (gu) {
                        self.gridUnits[row][col] = gu.getComponent(GridUnit);
                        gu.getComponent(GridUnit).node.setPosition(gud.localPosition);
                        gu.getComponent(GridUnit).gridData = gud;
                        gu.getComponent(GridUnit).Refresh();
                    }
                }
            }
        }
    }

    private CreateGrid() {
        if (this.gridPool == null) {
            this.gridPool = new Array<GridUnit>();
        }

        for (let index = 0; index < this.gridPool.length; index++) {
            if (!this.gridPool[index].node.active) {
                return this.gridPool[index];
            }
        }

        let gu = cc.instantiate(this.gridUnitModel);
        gu.parent = this.gridUnitsRoot;
        gu.setPosition(0, 0);
        this.gridPool.push(gu.getComponent(GridUnit));

        gu.on('clickGrid', this.clickGrid, this);
        return gu;
    }
    clickGrid(args) {
        let clicked = args.detail;
        let self = this;
        // console.log(clicked.gridData);
        //点中了格子
        if (clicked != null) {
            if (clicked.gridData.GridType == GridType.Obstacle) {
                //点中了障碍物！
                console.log("Clicked obstacle.");
                return;
            }
            if (this.from == null) {
                //当前还没有选择起始地点
                this.from = clicked;
                this.from.GridType = GridRanderType.Start;
            }
            else if (this.to == null) {
                //两次点中了起点
                let gridData = clicked.gridData;
                if (this.from.Equals(gridData.row, gridData.column))
                    return;

                //当前没有选择终点
                this.to = clicked;
                this.to.GridType = GridRanderType.End;
                //有起点有终点，开始导航
                if (MapNavigator.getInstance().Navigate(this.currentData.mapData, this.from.gridData, this.to.gridData, function (args) {
                    console.log(args);
                    self.path = args[0];
                    self.searched = args[1];
                    self.TestGridRender();
                })) {
                }
                else {
                    //没有找到路径
                    console.log('"Navitation failed. No path."');
                    return;
                }
                // EUtilityHelperL.Log(string.Format("Nav times:{0}, timeCost{1:00}", navTimes, EUtilityHelperL.TimerEnd()));
            }
            else {
                this.from.GridType = GridRanderType.Normal;
                this.from = null;
                this.to.GridType = GridRanderType.Normal;
                this.to = null;

                for (let index = 0; index < this.searched.length; index++) {
                    let item = this.searched[index];
                    this.gridUnits[item.row][item.column].GridType = GridRanderType.Normal;
                }

                for (let index = 0; index < this.path.length; index++) {
                    let item = this.path[index];
                    this.gridUnits[item.row][item.column].GridType = GridRanderType.Normal;
                }
            }
        }
        //没有点中格子
        else {
            if (this.from != null) {
                this.from.GridType = GridRanderType.Normal;
                this.from = null;
            }
            if (this.to != null) {
                this.to.GridType = GridRanderType.Normal;
                this.to = null;
            }

            for (let index = 0; index < this.searched.length; index++) {
                let item = this.searched[index];
                this.gridUnits[item.row][item.column].GridType = GridRanderType.Normal;
            }

            for (let index = 0; index < this.path.length; index++) {
                let item = this.path[index];
                this.gridUnits[item.row][item.column].GridType = GridRanderType.Normal;
            }
        }
    }

    TestGridRender() {
        let from = this.from;
        let to = this.to;
        for (let index = 0; index < this.path.length; index++) {
            const item = this.path[index];
            let gu = this.gridUnits[item.row][item.column];
            gu.GridType = GridRanderType.Path;
        }
    }

    RecycleAllGrids() {
        if (this.gridPool == null)
            return;

        for (let i = 0; i < this.gridPool.length; ++i) {
            let grid = this.gridPool[i];
            grid.node.active = false;
            grid.node.setPosition(0, 0);
        }

        this.gridUnits = null;
    }

    private UnloadBattleData() {
        this.RecycleAllGrids();
        this.currentData = null;
    }

    // update (dt) {}
}
