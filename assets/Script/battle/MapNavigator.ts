/*
 * @Author: super_javan 
 * @Date: 2022-04-27 14:04:33
 * @Last Modified by: super_javan
 * @Last Modified time: 2022-04-27 14:04:33
 * @Describe : 导航 六边形A*寻路
 */

import GridUnitData, { GridType } from "./GridUnitData";

const { ccclass, property } = cc._decorator;

class NavigationData {
    public open = true;
    public F = 0;
    public G = 0;
    public H = 0;

    public thisGrid: GridUnitData;
    public preGrid: NavigationData;
    constructor() {

    }
    public NavigationData() {
        this.Reset();
    }

    public Reset() {
        this.open = true;
        this.F = 0;
        this.G = 0;
        this.H = 0;

        if (this.thisGrid != null) {
            this.thisGrid.tempRef = null;
            this.thisGrid = null;
        }

        this.preGrid = null;
    }
}

@ccclass
export default class MapNavigator {
    private static mapNavigator: MapNavigator;
    private curUsedIdx = 0;
    private navigationDataPool: Array<NavigationData> = null;
    private inited: boolean = false;

    private constructor() { }

    public static getInstance(): MapNavigator {

        if (this.mapNavigator == null) {
            this.mapNavigator = new MapNavigator();
            this.mapNavigator.init();
        }

        return MapNavigator.mapNavigator;
    }

    init() {
        if (this.inited) return;

        this.inited = true;

        //先初始化一定的导航数据
        this.navigationDataPool = new Array<NavigationData>();
        for (let index = 0; index < 99; index++) {
            this.navigationDataPool.push(new NavigationData());
        }
    }

    GetEmptyNavigationData(_thisGrid, _preGrid, _G, _H) {
        let nd = null;
        if (this.curUsedIdx < this.navigationDataPool.length) {
            nd = this.navigationDataPool[this.curUsedIdx];
        } else {
            nd = new NavigationData();
            this.navigationDataPool.push(nd);
        }

        this.curUsedIdx++;

        nd.thisGrid = _thisGrid;
        nd.preGrid = _preGrid;
        nd.G = _G;
        nd.H = _H;
        nd.F = _G + _H;
        nd.open = true;
        nd.thisGrid.tempRef = nd;
        return nd;
    }

    Navigate(battleMap, from, to, callback) {
        if (battleMap == null) return false;

        let path = [];
        let searched = [];

        let tryTimes = battleMap.GridCount;
        let opening = new Array<NavigationData>();
        opening.push(this.GetEmptyNavigationData(from, null, 0, from.Distance(to)));

        let retry = 0;
        let catched = false;

        //当前探索方向
        let curDir = 0;
        //上次探索方向
        let lastDir = 0;
        let checkTimes = 0;

        //判断是否需要遍历open列表
        let gift = null;
        //距离最近的格子(接下来要移动的)
        let next_0 = null;
        //距离次近的格子
        let next_1 = null;

        let minStep = 99999;

        while (retry <= tryTimes && !catched) {
            retry++;
            //从open列表找最近的节点
            if (gift != null) {
                next_0 = gift;
                gift = null;
            } else if (next_1 != null) {
                next_0 = next_1;
                next_1 = null;
            } else {
                minStep = 99999;

                for (let i = opening.length - 1; i >= 0; --i) {
                    if (!opening[i].open) {
                        opening.slice(i, 1);
                    }
                    else if (opening[i].F < minStep) {
                        next_0 = opening[i];
                        minStep = next_0.F;
                    }
                    else if (next_1 == null && next_0 != null && opening[i].F == next_0.F) {
                        next_1 = opening[i];
                    }
                }
            }

            //标志为已关闭
            next_0.open = false;

            //放入已搜索中
            if (searched != null) {
                searched.push(next_0.thisGrid);
            }

            checkTimes = 6;
            curDir = lastDir;
            //遍历最近节点的周围6个节点，依次放入close中
            let roads = next_0.thisGrid.passes;
            while (checkTimes > 0) {
                //沿着当前探索方向继续探索
                if ((roads & (1 << curDir)) != 0) {
                    //获取该路通向的下一个item
                    let sibling = battleMap.GetGridDataByDir(next_0.thisGrid.row, next_0.thisGrid.column, curDir);
                    if (sibling == null) {
                        //没路
                        ++curDir;
                        curDir = (curDir > 5) ? 0 : curDir;
                        --checkTimes;
                        continue;
                    }
                    //如果这个不能移动
                    else if (sibling.GridType == GridType.Obstacle) {

                        //没路
                        ++curDir;
                        curDir = (curDir > 5) ? 0 : curDir;
                        --checkTimes;
                        continue;
                    }
                    else {
                        //如果这个item就是目标
                        if (sibling.Equals(to)) {
                            if (path != null) {
                                let current = next_0;
                                while (current != null) {
                                    if (current.thisGrid != from) {
                                        path.push(current.thisGrid);
                                    }
                                    current = current.preGrid;
                                }

                                catched = true;
                            }

                            break;
                        }
                        else {
                            //尝试判断这个是否为closed
                            let nd = sibling.tempRef == null ? null : sibling.tempRef as NavigationData;
                            if (nd == null) {
                                //这个格子没有探索过，新建并添加
                                nd = this.GetEmptyNavigationData(sibling, next_0, next_0.G + 1, sibling.Distance(to));
                                //这个格子不错哦
                                if (nd.F <= next_0.F && gift == null) {
                                    //保存礼物
                                    gift = nd;
                                    //记录下次起始的更新方向
                                    lastDir = curDir;
                                }
                                //比第二目标好
                                else if (next_1 != null && nd.F < next_1.F) {
                                    //替换第二目标
                                    next_1 = nd;
                                    opening.push(nd);
                                }
                                else {
                                    //已经设置了礼物，因此只能放入opening列表中，以后再更新了呢
                                    opening.push(nd);
                                }
                            }
                            else {
                                //只处理没有被探索过的格子
                                if (nd.open) {
                                    //已经在Open列表中了
                                    if ((next_0.G + 1) < nd.G) {
                                        //比原来的近，应该不可能
                                        nd.G = next_0.G + 1;
                                        nd.H = sibling.Distance(to);
                                        nd.F = nd.G + nd.H;
                                        nd.preGrid = next_0;
                                        nd.thisGrid = sibling;
                                    }
                                    //这个格子不错哦
                                    if (nd.F <= next_0.F && gift == null) {
                                        gift = nd;
                                        //保存当前探索方向
                                        lastDir = curDir;
                                    }
                                    else if (next_1 != null && nd.F < next_1.F) {
                                        //替换第二目标
                                        next_1 = nd;
                                    }
                                }
                            }
                        }
                    }
                }
                ++curDir;
                curDir = (curDir > 5) ? 0 : curDir;
                --checkTimes;
            }
        }
        opening = [];
        this.ResetPool();

        if (callback && catched) {
            let args = [path, searched];
            callback(args);
        }
    }

    private ResetPool() {
        for (let i = 0; i < this.curUsedIdx; ++i) {
            this.navigationDataPool[i].Reset();
        }
        this.curUsedIdx = 0;
    }

}

//export {GridUnitData as GridData}//导出重命名
