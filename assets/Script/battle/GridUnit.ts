/*
 * @Author: super_javan 
 * @Date: 2022-04-13 16:38:58 
 * @Last Modified by: super_javan
 * @Last Modified time: 2022-04-25 16:20:51
 * @Describe : 格子显示对象
 */

import GridUnitData, { GridType } from "./GridUnitData";

class MyEvent extends cc.Event {
    constructor(name: string, bubbles?: boolean, detail?: any) {
        super(name, bubbles);
        this.detail = detail;
    }
    public detail: any = null;  // 自定义的属性
}


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

    onLoad() {
        this.normalGrid.off(cc.Node.EventType.TOUCH_END, this.clickHandler, this);
        this.normalGrid.on(cc.Node.EventType.TOUCH_END, this.clickHandler, this);
    }

    clickHandler() {
        this.node.dispatchEvent(new MyEvent('clickGrid', true, this));
    }

    public Refresh() {
        let imgPath;

        switch (this.gridRanderType) {
            case GridRanderType.Start:
                imgPath = 'battle/img/Tiles/Terrain/Dirt/dirt_04';
                this.refreshGridIcon(imgPath);
                return;
            case GridRanderType.End:
                imgPath = 'battle/img/Tiles/Terrain/Dirt/dirt_03';
                this.refreshGridIcon(imgPath);
                return;
            case GridRanderType.Selected:
                imgPath = 'battle/img/Tiles/Terrain/Dirt/dirt_04';
                this.refreshGridIcon(imgPath);
                return;
            case GridRanderType.Path:
                imgPath = 'battle/img/Tiles/Terrain/Mars/mars_06';
                this.refreshGridIcon(imgPath);
                return;
            case GridRanderType.Searched:
                imgPath = 'battle/img/Tiles/Terrain/Mars/mars_08';
                this.refreshGridIcon(imgPath);
                return;
            case GridRanderType.Range:
                imgPath = 'battle/img/Tiles/Terrain/Dirt/dirt_10';
                this.refreshGridIcon(imgPath);
                return;
        }

        switch (this.gridData.GridType) {
            case GridType.Normal:
                imgPath = 'battle/img/Tiles/Terrain/Dirt/dirt_07';
                this.refreshGridIcon(imgPath);
                break;
            case GridType.Born:
                imgPath = 'battle/img/Tiles/Terrain/Dirt/dirt_04';
                this.refreshGridIcon(imgPath);
                break;
            case GridType.Obstacle:
                imgPath = 'battle/img/Tiles/Medieval/medieval_cabin';
                this.refreshGridIcon(imgPath);
                break;

            default:
                break;
        }


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
        this.Refresh();
    }

    public get GridType() {
        return this.gridRanderType;
    }

    public Equals(row, col): boolean {
        if (row == this.gridData.row && col == this.gridData.column) {
            return true;
        }
        return false;
    }

    // update (dt) {}
}

