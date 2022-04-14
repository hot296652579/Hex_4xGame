/*
 * @Author: super_javan 
 * @Date: 2022-04-13 16:38:58 
 * @Last Modified by: super_javan
 * @Last Modified time: 2022-04-13 17:29:17
 * @Describe : 格子显示对象
 */

import GridUnitData, { GridType } from "./GridUnitData";


const {ccclass, property} = cc._decorator;

@ccclass
export default class GridUnit extends cc.Component {

    @property(cc.Node)
    normalGrid: cc.Node = null;

    @property(cc.Node)
    obstacleGrid: cc.Node = null;

    public gridData:GridUnitData = null;

    start () {
        // this.normalGrid.active = false;
        // this.obstacleGrid.active = false;
    }

    public Refresh(){
        switch (this.gridData.gridType) {
            case GridType.Normal:
                this.normalGrid.active = true;
                this.obstacleGrid.active = false;
                break;
            case GridType.Obstacle:
                this.obstacleGrid.active = true;
                this.normalGrid.active = false;
                break;
        
            default:
                break;
        }
    }

    // update (dt) {}
}
