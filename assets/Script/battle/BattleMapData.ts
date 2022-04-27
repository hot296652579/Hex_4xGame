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

    public mapWidth = 0;
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
        this.mapWidth = width;
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
                gud.GridType = GridType.Normal;
            }
        }

        this.GenerateObstacle(obstacle, gap);
        this.TidyGridList();
    }

    GenerateObstacle(obstacleCount, gap) {
        let self = this;
        let randomRange = new Array<GridUnitData>(); //随机范围
        let reduction = new Array<GridUnitData>(); //去掉不能随机的格子

        let height = this.mapHeight;
        let width = this.mapWidth;

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
            maxColumn = Math.min(this.mapWidth - 1, maxColumn + (range - index));

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
            for (let j = 0; j < this.mapWidth; j++) {
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

    GetGridData(row, column): GridUnitData {
        if (row < 0 || row >= this.mapHeight || column < 0 || column >= this.mapWidth)
            return null;

        return this.mapGrids[column][row];
    }

    GetGridDataByDir(row, column, dir) {
        switch (dir) {
            //9点钟方向格子
            case 0:
                return this.GetGridData(row, column - 1);

            //7点钟方向格子
            case 1:
                return this.GetGridData(row + 1, ((row & 1) > 0) ? column - 1 : column);

            //5点钟方向
            case 2:
                return this.GetGridData(row + 1, ((row & 1) > 0) ? column : column + 1);

            //3点钟方向
            case 3:
                return this.GetGridData(row, column + 1);

            //1点钟方向
            case 4:
                return this.GetGridData(row - 1, ((row & 1) > 0) ? column : column + 1);

            //11点钟方向
            case 5:
                return this.GetGridData(row - 1, ((row & 1) > 0) ? column - 1 : column);

            default:
                return null;
        }
    }

    public get GridCount() {
        return this.mapWidth * this.mapHeight;
    }

    public get BornCount() {
        return Math.floor(this.bornGrids.length * 0.5);
    }

    // update (dt) {}
}
