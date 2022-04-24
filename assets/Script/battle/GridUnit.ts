/*
 * @Author: super_javan 
 * @Date: 2022-04-13 16:38:58 
 * @Last Modified by: super_javan
 * @Last Modified time: 2022-04-13 17:29:17
 * @Describe : 格子显示对象
 */

import GridUnitData, { GridType } from "./GridUnitData";


const { ccclass, property } = cc._decorator;
export enum GridRanderType {
    Normal,     //普通
    Selected,   //只是被选中
    Start,      //寻路的起点
    End,        //寻路的重点
    Path,       //寻路结果经过
    Searched,   //被搜索过的
    Range,      //范围
}

@ccclass
export default class GridUnit extends cc.Component {

    @property(cc.Node)
    normalGrid: cc.Node = null;

    @property(cc.Node)
    obstacleGrid: cc.Node = null;

    public gridData: GridUnitData = null;

    start() {
        // this.normalGrid.active = false;
        // this.obstacleGrid.active = false;
    }

    public Refresh() {
        let imgPath;
        switch (this.gridData.gridType) {
            case GridType.Normal:
                this.normalGrid.active = true;
                this.obstacleGrid.active = false;
                imgPath = 'battle/img/Tiles/Terrain/dirt_07';
                break;
            case GridType.Obstacle:
                this.obstacleGrid.active = true;
                this.normalGrid.active = false;
                imgPath = 'battle/img/Tiles/Medieval/medieval_cabin';
                break;

            default:
                break;
        }

        // this.refreshGridIcon(imgPath);
    }

    refreshGridIcon(imgPath) {
        // let self = this;
        // cc.resources.load(imgPath, cc.SpriteFrame, (err, spriteFrame) => {
        //     let sp = self.normalGrid.getComponent(cc.Sprite);
        //     sp.spriteFrame = spriteFrame;
        // });
    }

    public set GridType(type) {
        this.gridData.GridType = type;
    }

    public get GridType() {
        return this.gridData.GridType;
    }

    // public Equals(obj: Object): boolean {

    // }

    // update (dt) {}
}

