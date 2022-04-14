/*
 * @Author: super_javan 
 * @Date: 2022-04-12 22:17:59 
 * @Last Modified by: super_javan
 * @Last Modified time: 2022-04-13 18:17:43
 * @Describe : 战斗数据模块
 */

import GridUnitData, { GridType } from "./GridUnitData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BattleData {
    constructor(){}
    GridWidth = 120;
    GridOffsetY = 110;

    public mapWith = 0;
    public mapHeight = 0;

    public mapGrids: Array<Array<GridUnitData>>;

    private normalGrids:Array<GridUnitData>;
    private obstacleGrids:Array<GridUnitData>;
    start () {
        
    }

    public Generate(width,height,obstacle,gap){
        if(width < 0 || height < 0)return;

        let self = this;
        this.mapHeight = height;
        this.mapWith = width;
        this.mapGrids = new Array<Array<GridUnitData>>();
        for(let i = 0 ; i < width ; i ++){
            this.mapGrids.push(new Array<GridUnitData>());
        }
        for(let i = 0 ; i < width ; i ++){
            for(let j = 0 ; j < height ; j ++){
                this.mapGrids[i].push(new GridUnitData);
            }
        }
        console.log(this.mapGrids);

        this.normalGrids = new Array<GridUnitData>();
        this.obstacleGrids = new Array<GridUnitData>();

        for (let r = 0; r < width; r++) {
            for (let c = 0; c < height; c++) {
                let gud = new GridUnitData();
                gud.localPosition = new cc.Vec2(c * this.GridWidth + ((r & 1) > 0 ? (this.GridWidth / 2):0),
                                                r * this.GridOffsetY);
                gud.gridPosition = new cc.Vec2(r,c);
                this.mapGrids[r][c] = gud;
                this.setGridType(gud,GridType.Normal);
            }
        }

        this.disposeGridUnits(obstacle,gap);
    }

    private setGridType(gud,gt){
        switch(gt){
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
    private disposeGridUnits(obstacle,gap){
        obstacle = Math.min(this.mapWith * this.mapHeight,obstacle);

        for (let index = 0; index < obstacle; index++) {
            let randomIdx = -1;
            let target:GridUnitData = null;
            
            let tryTimes = 999;
            while (tryTimes > 0 && target == null) {
                randomIdx = Math.floor(Math.random() * (this.normalGrids.length - 0)) + 0;
                target = this.normalGrids[randomIdx];

                //距离判断
                for (let j = 0; j < this.obstacleGrids.length; j++) {
                    let distance = this.obstacleGrids[j].Distance(target);
                    if(distance < gap){
                        target = null;
                        break;
                    }
                }
                tryTimes--;
            }

            if(target != null){
                this.setGridType(target,GridType.Obstacle);
                this.normalGrids.slice(randomIdx,1);
            }else{
                console.log('随机障碍格子数据错误!')
            }
        }
    }

    // update (dt) {}
}
