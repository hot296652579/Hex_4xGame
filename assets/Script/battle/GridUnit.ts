/*
 * @Author: super_javan 
 * @Date: 2022-04-13 16:38:58 
 * @Last Modified by: super_javan
 * @Last Modified time: 2022-04-24 19:33:49
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
    private gridRanderType: GridRanderType = null;

    start() {
        // this.normalGrid.active = false;
        // this.obstacleGrid.active = false;
    }

    public Refresh() {
        let imgPath;

        switch (this.gridRanderType) {
            case GridRanderType.Start:
                imgPath = 'battle/img/Tiles/Terrain/Dirt/dirt_04';
                break;
            case GridRanderType.End:
                imgPath = 'battle/img/Tiles/Terrain/Dirt/dirt_03';
                break;
            case GridRanderType.Selected:
                imgPath = 'battle/img/Tiles/Terrain/Dirt/dirt_04';
                break;
            case GridRanderType.Path:
                imgPath = 'battle/img/Tiles/Terrain/Mars/mars_06';
                break;
            case GridRanderType.Searched:
                imgPath = 'battle/img/Tiles/Terrain/Mars/mars_08';
                break;
            case GridRanderType.Range:
                imgPath = 'battle/img/Tiles/Terrain/Dirt/dirt_10';
                break;

            default:
                break;
        }

        switch (this.gridData.gridType) {
            case GridType.Normal:
                imgPath = 'battle/img/Tiles/Terrain/Dirt/dirt_07';
                break;
            case GridType.Born:
                imgPath = 'battle/img/Tiles/Terrain/Dirt/dirt_07';
                break;
            case GridType.Obstacle:
                imgPath = 'battle/img/Tiles/Medieval/medieval_cabin';
                break;

            default:
                break;
        }

        this.refreshGridIcon(imgPath);
    }

    refreshGridIcon(imgPath) {
        let normalGrid = this.normalGrid;
        let component = null;
        let loadCallBack = function (err, res) {
            component = normalGrid.getComponent(cc.Sprite);
            component.spriteFrame = res;
        }
        console.log(imgPath)
        cc.resources.load(imgPath, cc.SpriteFrame, loadCallBack);
    }

    public set GridType(type) {
        this.gridRanderType = type;
    }

    public get GridType() {
        return this.gridRanderType;
    }

    // public Equals(obj: Object): boolean {

    // }

    // update (dt) {}
}

