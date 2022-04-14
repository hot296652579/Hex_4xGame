/*
 * @Author: super_javan 
 * @Date: 2022-04-12 22:31:53 
 * @Last Modified by: super_javan
 * @Last Modified time: 2022-04-13 18:04:33
 * @Describe : 格子数据
 */

const {ccclass, property} = cc._decorator;
export enum GridType{
    Normal,   //平地
    Obstacle  //障碍
}

@ccclass
export default class GridUnitData {

    public gridType:GridType;
    public gridPosition:cc.Vec2;
    public localPosition:cc.Vec2;

    /**计算两个格子之间距离*/
    public Distance(target:GridUnitData){
        let rowGap = Math.abs(target.gridPosition.x - this.gridPosition.x)
        //列范围
        let offset = (((rowGap & 1) == 0) ? 0 : 1) + rowGap / 2;
        //如果在范围内，移动量就是行移动量
        if (target.gridPosition.y >= (this.gridPosition.y - offset) && (target.gridPosition.y <= (this.gridPosition.y + offset)))
        {
            //Debug.Log(string.Format("({0},{1})->({2},{3})->{4}", target.row, target.column, row, column, rowGap));
            return rowGap;
        }
        else if (target.gridPosition.y > (this.gridPosition.y + offset))
        {
            //Debug.Log(string.Format("({0},{1})->({2},{3})->{4}", target.row, target.column, row, column, rowGap + (target.column - column - offset)));
            return rowGap + (target.gridPosition.y - this.gridPosition.y - offset);
        }
        else
        {
            //Debug.Log(string.Format("({0},{1})->({2},{3})->{4}", target.row, target.column, row, column, rowGap + column - offset - target.column));
            return rowGap + this.gridPosition.y - offset - target.gridPosition.y;
        }
    }
}

//export {GridUnitData as GridData}//导出重命名
