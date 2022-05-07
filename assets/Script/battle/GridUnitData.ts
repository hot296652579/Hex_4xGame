/*
 * @Author: super_javan 
 * @Date: 2022-04-12 22:31:53 
 * @Last Modified by: super_javan
 * @Last Modified time: 2022-04-13 18:04:33
 * @Describe : 格子数据
 */

const { ccclass, property } = cc._decorator;
export enum GridType {
    None,
    Normal,   //平地
    Obstacle, //障碍
    Born
}

@ccclass
export default class GridUnitData {

    public gridType: GridType;
    public gridPosition: cc.Vec2;
    public localPosition: cc.Vec2;
    public tempRef: Object;
    row: number;
    column: number;
    passes: number;

    constructor(row, column) {
        this.row = row;
        this.column = column;
    }

    /**计算两个格子之间距离*/
    public Distance(target: GridUnitData) {
        // let rowGap = Math.abs(target.gridPosition.x - this.gridPosition.x)
        // //列范围
        // let offset = (((rowGap & 1) == 0) ? 0 : 1) + rowGap / 2;
        // //如果在范围内，移动量就是行移动量
        // if (target.gridPosition.y >= (this.gridPosition.y - offset) && (target.gridPosition.y <= (this.gridPosition.y + offset))) {
        //     //Debug.Log(string.Format("({0},{1})->({2},{3})->{4}", target.row, target.column, row, column, rowGap));
        //     return rowGap;
        // }
        // else if (target.gridPosition.y > (this.gridPosition.y + offset)) {
        //     //Debug.Log(string.Format("({0},{1})->({2},{3})->{4}", target.row, target.column, row, column, rowGap + (target.column - column - offset)));
        //     return rowGap + (target.gridPosition.y - this.gridPosition.y - offset);
        // }
        // else {
        //     //Debug.Log(string.Format("({0},{1})->({2},{3})->{4}", target.row, target.column, row, column, rowGap + column - offset - target.column));
        //     return rowGap + this.gridPosition.y - offset - target.gridPosition.y;
        // }

        let rowGap = Math.abs(target.row - this.row); //行差
        let minColumn = 0;
        let maxColumn = 0;

        //奇数开始
        if ((this.row & 1) > 0) {
            minColumn = Math.max(this.column - (rowGap / 2), 0);
            maxColumn = Math.floor(this.column + ((rowGap + 1) / 2));
        }
        //偶数开始
        else {
            minColumn = Math.max(this.column - ((rowGap + 1) / 2), 0);
            maxColumn = Math.floor(this.column + (rowGap / 2));
        }

        //在移动范围之外，额外增加
        if (target.column < minColumn)
            return rowGap + minColumn - target.column;
        else if (target.column > maxColumn)
            return rowGap + target.column - maxColumn;
        //在移动范围之内，因此行移动量就是两格子的距离
        else
            return rowGap;
    }

    public Equals(obj: Object): boolean {
        if (obj instanceof GridUnitData) {
            let data = obj as GridUnitData;
            return data.row == this.row && data.column == this.column;
        }

        return false;
    }

    public set GridType(type) {
        this.gridType = type;
        switch (this.gridType) {
            case GridType.None:
                this.passes = 0;
                break;
            case GridType.Normal:
                this.passes = 63;
                break;
            case GridType.Obstacle:
                this.passes = 0;
                break;
            case GridType.Born:
                this.passes = 63;
                break;
            default:
                this.passes = 63;
                break;
        }
    }

    public get GridType() {
        return this.gridType;
    }
}

//export {GridUnitData as GridData}//导出重命名
