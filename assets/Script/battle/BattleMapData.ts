/*
 * @Author: super_javan 
 * @Date: 2022-04-12 22:17:59 
 * @Last Modified by: super_javan
 * @Last Modified time: 2022-04-25 15:34:56
 * @Describe : 战斗数据模块
 */

import GridUnitData, { GridType } from "./GridUnitData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BattleMapData {
    constructor() { }
    GridWidth = 120;
    GridOffsetY = 110;

    public mapWith = 0;
    public mapHeight = 0;

    public mapGrids: Array<Array<GridUnitData>>;

    private bornGrids: Array<GridUnitData>;
    private normalGrids: Array<GridUnitData>;
    private obstacleGrids: Array<GridUnitData>;
    start() {

    }

    public Generate(width, height, obstacle, gap) {
        if (width < 0 || height < 0) return;

        let self = this;
        this.mapHeight = height;
        this.mapWith = width;
        this.mapGrids = new Array<Array<GridUnitData>>();
        for (let i = 0; i < width; i++) {
            this.mapGrids.push(new Array<GridUnitData>());
        }
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                this.mapGrids[i].push(new GridUnitData(i, j));
            }
        }
        console.log(this.mapGrids);

        this.normalGrids = new Array<GridUnitData>();
        this.obstacleGrids = new Array<GridUnitData>();
        this.bornGrids = new Array<GridUnitData>();

        for (let r = 0; r < height; r++) {
            for (let c = 0; c < width; c++) {
                let gud = new GridUnitData(r, c);
                gud.localPosition = new cc.Vec2(c * this.GridWidth + ((r & 1) > 0 ? (this.GridWidth / 2) : 0),
                    r * this.GridOffsetY);
                gud.gridPosition = new cc.Vec2(r, c);
                this.mapGrids[r][c] = gud;
                // this.setGridType(gud, GridType.Normal);
                gud.GridType = GridType.Normal;
            }
        }

        // this.disposeGridUnits(obstacle, gap);
        this.GenerateObstacle(obstacle, gap);
        this.TidyGridList();
    }

    GenerateObstacle(obstacleCount, gap) {
        let self = this;
        let randomRange = new Array<GridUnitData>(); //随机范围
        let reduction = new Array<GridUnitData>(); //去掉不能随机的格子

        let height = this.mapHeight;
        let width = this.mapWith;

        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                let grid = self.mapGrids[i][j];
                if (grid.GridType == GridType.Normal) {
                    randomRange.push(grid);
                }
            }
        }

        let count = obstacleCount;
        while (count > 0 && randomRange.length > 0) {
            let randomCount = randomRange.length
            let randIdx = Math.floor(Math.random() * (randomCount - 0) + 0);
            let randomGrid = randomRange[randIdx];
            randomGrid.GridType = GridType.Obstacle;

            this.GetRangeGrids(randomGrid.row, randomGrid.column, gap, reduction);
            if (reduction.length > 0) {
                for (let index = 0; index < reduction.length; index++) {
                    const element = reduction[index];
                    randomRange.slice(index, 1);
                }
            }
            --count;
        }
    }

    //根据圆心获取范围格子
    GetRangeGrids(row, column, range, grids) {
        if (!grids || range <= 0) return;

        grids = [];

        for (let index = 0; index <= range; index++) {
            let rowGap = index; //计算一行的范围
            let minColumn = 0;
            let maxColumn = 0;

            //奇数
            if ((row & 1) > 0) {
                minColumn = Math.max(column - (rowGap / 2), 0);
                maxColumn = column + ((rowGap + 1) / 2);
            }
            else {
                //偶数
                minColumn = Math.max(column - ((rowGap + 1) / 2), 0);
                maxColumn = column + (rowGap / 2);
            }

            //列范围
            minColumn = Math.max(0, minColumn - (range - index));
            maxColumn = Math.min(this.mapWith - 1, maxColumn + (range - index));

            for (let c = 0; c <= maxColumn; c++) {
                if (index == 0) {
                    grids.push(this.mapGrids[c][row]);
                }
                else {
                    let temp = row - index;
                    if (temp >= 0)
                        grids.push(this.mapGrids[c][temp]);

                    temp = row + index;
                    if (temp < this.mapHeight)
                        grids.push(this.mapGrids[c][temp]);
                }
            }
        }
    }

    TidyGridList() {
        this.normalGrids = [];
        this.bornGrids = [];
        this.obstacleGrids = [];

        for (let i = 0; i < this.mapHeight; i++) {
            for (let j = 0; j < this.mapWith; j++) {
                let grid = this.mapGrids[i][j];
                if (grid) {
                    switch (grid.GridType) {
                        case GridType.Normal:
                            this.normalGrids.push(grid);
                            break;
                        case GridType.Obstacle:
                            this.obstacleGrids.push(grid);
                            break;
                        case GridType.Born:
                            this.bornGrids.push(grid);
                            break;

                        default:
                            break;
                    }
                }
            }
        }
    }

    private setGridType(gud, gt) {
        switch (gt) {
            case GridType.Normal:
                this.normalGrids.push(gud);
                break;

            case GridType.Obstacle:
                this.obstacleGrids.push(gud);
                break;
        }
        gud.gridType = gt;
    }

    //随机放障碍物
    private disposeGridUnits(obstacle, gap) {
        obstacle = Math.min(this.mapWith * this.mapHeight, obstacle);

        for (let index = 0; index < obstacle; index++) {
            let randomIdx = -1;
            let target: GridUnitData = null;

            let tryTimes = 999;
            while (tryTimes > 0 && target == null) {
                randomIdx = Math.floor(Math.random() * (this.normalGrids.length - 0)) + 0;
                target = this.normalGrids[randomIdx];

                //距离判断
                for (let j = 0; j < this.obstacleGrids.length; j++) {
                    let distance = this.obstacleGrids[j].Distance(target);
                    if (distance < gap) {
                        target = null;
                        break;
                    }
                }
                tryTimes--;
            }

            if (target != null) {
                this.setGridType(target, GridType.Obstacle);
                this.normalGrids.slice(randomIdx, 1);
            } else {
                console.log('随机障碍格子数据错误!')
            }
        }
    }

    public get GridCount() {
        return this.mapWith * this.mapHeight;
    }

    public get BornCount() {
        return Math.floor(this.bornGrids.length * 0.5);
    }

    // update (dt) {}
}
