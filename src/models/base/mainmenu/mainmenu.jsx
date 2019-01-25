import { config } from '../../../services/HttpService';
import { httpPost } from '../../../services/HttpService';
import { routerRedux } from 'dva/router';
import Message from 'antd/lib/message';
import { httpPostByIds, httpPostNoParam, httpPostWithId } from "../../../services/HttpService";



function isExist(path) {

    var isExist = false;

    myApp._store.getState().menu.allMenu.map((i) => {

        if (i.children) {
            i.children.map((j) => {

                if (j.children) {
                    j.children.map((h) => {

                        if (path == h.resourceroute) {

                            isExist = true;

                        }
                    })
                }

                if (path == j.resourceroute) {

                    isExist = true;
                }
            })
        }else{
            if (path == i.resourceroute) {

                isExist = true;
            }

        }

    })

    return isExist;
}

export default {

    namespace: 'menu',

    state: {
        openKeys: [],
        msg: '',	// 接口返回错误信息
        maskstatus: '', // 遮罩层显示状态
        ajaxstatus: '',	// 接口返回错误信息显示状态
        mainmenu: [

            // {
            //     "code": 1,
            //     "parentCode": 0,
            //     "name": "组织机构",
            //     "icontype":"fork",
            //     "children": [
            //         {
            //             "code": 101,
            //             "parentCode": 1,
            //             "name": "机构管理",
            //             "resourceroute": "/jggl"
            //         },
            //         {
            //             "code": 102,
            //             "parentCode": 1,
            //             "name": "品牌管理",
            //             "resourceroute": "/ppgl"
            //         },
            //         {
            //             "code": 103,
            //             "parentCode": 1,
            //             "name": "区域管理",
            //             "resourceroute": "/qygl"
            //         },
            //         {
            //             "code": 104,
            //             "parentCode": 1,
            //             "name": "餐厅管理",
            //             "resourceroute": "/ctgl"
            //         }
            //     ]
            // },
            {
                "code": 9,
                "parentCode": 0,
                "name": "连锁运营",
                "icontype": "lock",
                "children": [
                    {
                        "code": 901,
                        "parentCode": 9,
                        "name": "菜品库",
                        "children": [

                        ],
                        "resourceroute": "/cpk"
                    },
                    {
                        "code": 904,
                        "parentCode": 9,
                        "name": "通知中心",
                        "children": [

                        ],
                        "resourceroute": "/tzzx"
                    },
                    {
                        "code":903,
                        "parentCode":9,
                        "name":"任务管理",
                        "children":[
                            {
                                "code": 90301,
                                "parentCode": 903,
                                "name": "品牌任务库",
                                "resourceroute": "/pprwk"
                            },
                            {
                                "code": 90302,
                                "parentCode": 903,
                                "name": "任务方案",
                                "resourceroute": "/rwfa"
                            },
                            /*{
                                "code": 90303,
                                "parentCode": 903,
                                "name": "店铺任务",
                                "resourceroute": "/dprw"
                            },*/
                        ],
                        //"resourceroute": "/tzzx"
                    },
                    // {
                    //     "code":905,
                    //     "parentCode":9,
                    //     "name":"视频管理",
                    //     "resourceroute": "/lsvideo"
                    // }

                    // {
                    //     "code":902,
                    //     "parentCode":9,
                    //     "name":"设备管理",
                    //     "children":[
                    //
                    //     ],
                    //     "resourceroute": "/sbgl"
                    // }
                    {
                        "code": 906,
                        "parentCode": 9,
                        "name": "连锁支付管理",
                        "children": [

                        ],
                        "resourceroute": "/lszfgl"
                    },
                    {
                        "code": 907,
                        "parentCode": 9,
                        "name": "连锁原因备注",
                        "children": [

                        ],
                        "resourceroute": "/lsyybz"
                    },
                    {
                        "code": 908,
                        "parentCode": 9,
                        "name": "连锁协议企业",
                        "children": [

                        ],
                        "resourceroute": "/lsxyqy"
                    },
                    {
                        "code":909,
                        "parentCode":9,
                        "name":"菜品运营类别",
                        "resourceroute": "/cpyylb"

                    },
                    {
                        "code":910,
                        "parentCode":9,
                        "name":"外卖授权模式",
                        "resourceroute": "/wmsqms"
                    }
                ]
            },
            {
                "code": 2,
                "parentCode": 0,
                "name": "餐厅管理",
                "icontype": "coffee",

                "children": [
                    {
                        "code": 201,
                        "parentCode": 2,
                        "name": "基础设置",
                        "resourceroute": "/jcsz"
                    },
                    {
                        "code": 202,
                        "parentCode": 2,
                        "name": "菜单管理",
                        "resourceroute": "/cdgl"
                    },
                    {
                        "code":215,
                        "parentCode":2,
                        "name":"菜品排序",
                        "resourceroute": "/cppx"
                    },
                    {
                        "code": 203,
                        "parentCode": 2,
                        "name": "餐台管理",
                        "resourceroute": "/ctaigl"
                    },
                    {
                        "code": 205,
                        "parentCode": 2,
                        "name": "支付管理",
                        "resourceroute": "/zfgl"
                    },
                    {
                        "code": 207,
                        "parentCode": 2,
                        "name": "打印机管理",
                        "resourceroute": "/dyjgl"
                    },
                    {
                        "code": 208,
                        "parentCode": 2,
                        "name": "原因备注",
                        "resourceroute": "/yybz"
                    },
                    {
                        "code": 211,
                        "parentCode": 2,
                        "name": "触摸屏管理",
                        "resourceroute": "/cmpgl"
                    },
                    {

                        "code": 212,
                        "parentCode": 2,
                        "name": "厨房管理列表",
                        "resourceroute": "/cfgllb"
                    },
                    {
                        "code":216,
                        "parentCode":2,
                        "name":"视频配置",
                        "resourceroute": "/video"
                    }


                ]
            },
            {
                "code":12,
                "parentCode":0,
                "name":"业务配置",
                "icontype": "laptop",
                "resourceroute": "/ywpz"

            },
            {
                "code": 10,
                "parentCode": 0,
                "name": "外卖餐厅",
                "icontype": "car",
                "children": [
                    {
                        "code": 1001,
                        "parentCode": 10,
                        "name": "门店绑定",
                        "children": [
                        ],
                        "resourceroute": "/mdbd"
                    },
                    {
                        "code": 1002,
                        "parentCode": 10,
                        "name": "关联外卖菜品",
                        "children": [
                        ],
                        "resourceroute": "/glwmcp"
                    },
                    {
                        "code": 1003,
                        "parentCode": 10,
                        "name": "订单管理",
                        "children": [
                        ],
                        "resourceroute": "/ddgl"
                    },
                    // {
                    //     "code": 1004,
                    //     "parentCode": 10,
                    //     "name": "饿了么维护",
                    //     "children": [
                    //     ],
                    //     "resourceroute": "/elmwh"
                    // },
                    // {
                    //     "code": 1005,
                    //     "parentCode": 10,
                    //     "name": "美团维护",
                    //     "children": [
                    //     ],
                    //     "resourceroute": "/mtwh"
                    // },
                ]
            },
            // {
            //     "code": 3,
            //     "parentCode": 0,
            //     "name": "会员管理",
            //     "icontype": "pay-circle-o",
            //     "checked": true,
            //     "children": [
            //         {
            //             "code": 303,
            //             "parentCode": 3,
            //             "name": "会员办卡详情",
            //             "resourceroute": "/hybkxq"
            //         }
            //     ]
            // },
            // {
            //     "code": 4,
            //     "parentCode": 0,
            //     "name": "系统管理",
            //     "icontype":"setting",
            //     "checked": true,
            //     "children": [
            //         {
            //             "code": 401,
            //             "parentCode": 4,
            //             "name": "系统设置",
            //             "resourceroute": "/xtsz"
            //         }
            //
            //     ]
            // },
            // {
            //     "code": 5,
            //     "parentCode": 0,
            //     "name": "员工管理",
            //     "icontype":"user",
            //     "children": [
            //         {
            //             "code": 501,
            //             "parentCode": 5,
            //             "name": "员工管理",
            //             "resourceroute": "/yggl"
            //         },
            //         {
            //             "code": 502,
            //             "parentCode": 5,
            //             "name": "组别管理",
            //             "resourceroute": "/zbgl"
            //         }
            //     ]
            // },
            {
                "code": 6,
                "parentCode": 0,
                "name": "营销活动",
                "icontype": "gift",
                "children": [
                    // {
                    //     "code": 601,
                    //     "parentCode": 6,
                    //     "name": "优惠券列表",
                    //     "resourceroute": "/yhqlb"
                    // },
                    {
                        "code": 602,
                        "parentCode": 6,
                        "name": "评论返红包",
                        "resourceroute": "/plfhb"
                    },
                    // {
                    //     "code": 603,
                    //     "parentCode": 6,
                    //     "name": "菜品返积分",
                    //     "resourceroute": "/cpfjf"
                    // },
                    {
                        "code": 604,
                        "parentCode": 6,
                        "name": "关注送菜品",
                        "resourceroute": "/gzscp"
                    },
                    // {
                    //     "code": 605,
                    //     "parentCode": 6,
                    //     "name": "营销活动",
                    //     "resourceroute": "/yxhdlist"
                    // },
                    // {
                    //     "code": 606,
                    //     "parentCode": 6,
                    //     "name": "优惠券管理",
                    //     "resourceroute": "/yhqhdlist"
                    // },
                    {
                        "code": 607,
                        "parentCode": 6,
                        "name": "营销管理",
                        "resourceroute": "/hdgllist"
                    },

                ]
            },
            {
                "code": 7,
                "parentCode": 0,
                "name": "扫码点餐配置",
                "icontype": "scan",
                "resourceroute": "/ztewm",
                // "children": [
                //     /*{
                //         "code": 701,
                //         "parentCode": 7,
                //         "name": "扫码点餐设置",
                //         "resourceroute": "/smdcsz"
                //     },*/
                //     /*{
                //         "code": 702,
                //         "parentCode": 7,
                //         "name": "扫码点餐设置",
                //         "resourceroute": "/ztewm"
                //     },*/
                //     /*{
                //         "code": 703,
                //         "parentCode": 7,
                //         "name": "智能后厨",
                //         "resourceroute": "/znhc"
                //     }*/
                // ]
            },
            {
                "code": 8,
                "parentCode": 0,
                "name": "报表",
                "icontype": "table",
                "children": [
                    {
                        "code": 801,
                        "parentCode": 8,
                        "name": "营业报表",
                        "resourceroute": "/yybb"
                    },
                    {
                        "code": 802,
                        "parentCode": 8,
                        "name": "菜品销量",
                        "resourceroute": "/cpxl"
                    },
                    {
                        "code": 803,
                        "parentCode": 8,
                        "name": "计件分析",
                        "resourceroute": "/jjfx"
                    },
                    {
                        "code": 804,
                        "parentCode": 8,
                        "name": "现金分析",
                        "resourceroute": "/xjbbfx"
                    },
                    {
                        "code": 805,
                        "parentCode": 8,
                        "name": "账单管理",
                        "resourceroute": "/zdgl"
                    },
                    {
                        "code": 806,
                        "parentCode": 8,
                        "name": "外卖报表",
                        "resourceroute": "/wmbb"
                    },
                ]
            },
            {
                "code": 11,
                "parentCode": 0,
                "name": "餐厅营销",
                "icontype": "gift",
                "children": [{
                    "code": 1101,
                    "parentCode": 11,
                    "name": "协议企业",
                    "resourceroute": "/xyqy"
                }, {
                    "code": 1102,
                    "parentCode": 11,
                    "name": "折扣管理",
                    "resourceroute": "/zcgl"
                }]
            }

            /*{
                "code": 8,
                "parentCode": 0,
                "name": "报表",
                "icontype":"table",
                "children": [
                    {
                        "code": 801,
                        "parentCode": 8,
                        "name": "营业汇总表",
                        "resourceroute": "/yyhzb"
                    },
                    {
                        "code": 811,
                        "parentCode": 8,
                        "name": "营业明细表",
                        "resourceroute": "/yymxb"
                    },
                    //{
                    //    "code": 802,
                    //    "parentCode": 8,
                    //    "name": "付款类型汇总表 ",
                    //    "resourceroute": "/fklxhzb"
                    //},
                    {
                        "code": 803,
                        "parentCode": 8,
                        "name": "账单明细表",
                        "resourceroute": "/zdmxb"
                    },
                    {
                        "code": 804,
                        "parentCode": 8,
                        "name": "菜品销售表",
                        "resourceroute": "/cpxsb"
                    },
                    {
                        "code": 812,
                        "parentCode": 8,
                        "name": "日菜品销量排行",
                        "resourceroute": "/mrcpxlphfxb"
                    },
                    {
                        "code": 805,
                        "parentCode": 8,
                        "name": "菜品分类占比",
                        "resourceroute": "/cpflzb"
                    },
                    {
                        "code": 806,
                        "parentCode": 8,
                        "name": "退菜赠菜明细表",
                        "resourceroute": "/tczcmxb"
                    },
                    //{
                    //    "code": 807,
                    //    "parentCode": 8,
                    //    "name": "交班信息表",
                    //    "resourceroute": "/jbxxb"
                    //},


                    {
                        "code": 810,
                        "parentCode": 8,
                        "name": "免单明细表",
                        "resourceroute": "/mdmxb"
                    },
                    {
                        "code": 809,
                        "parentCode": 8,
                        "name": "反结账报表",
                        "resourceroute": "/fjzbb"
                    },
                    {
                        "code": 808,
                        "parentCode": 8,
                        "name": "计件统计表",
                        "resourceroute": "/jjtjb"
                    },
                    {
                        "code": 813,
                        "parentCode": 8,
                        "name": "现金分析表",
                        "resourceroute": "/xjbbfx"
                    },
                ]
            }*/
        ],
        returnmainmenu: [

        ],
        secondMenu: [

        ],
        thirdMenu: [],
        allMenu: [],
        defaultHeaderMenu: [],
        leftSelectKeys: [],
        restaurantList: [],
        brandList: [],
        brandId: -1,
        restaurantId: -1,
        keys:["/welcome","/login","/lszfgl","/lszfglForm","/lsyybz","/yybb","/cpxl","/zdgl","/jyzd","/jyzdDetail","/zjzd","/zhls","/jjfx","/xjbbfx","/yyhzb","/yymxb","/zdmxb","/mdmxb","/tczcmxb","/sdfx","/fjzbb","/cpxsb","/mrcpxlphfxb","/cpflzb","/jjtotal","/cwkmgl","/xjbbInfo","/xjrb","/xjyb",'/hybkxq','/ymhzb',
            "/cpk","/lscpxx","/lstcxx","/lscpxxdeploy","/lstcxxdeploy","/sbgl",'/lslabeldetail','/tzzx',
            '/pprwk','/renwuAdd','/rwfa','/newFangan','/dprw','/dprwDetail','/wmbb','/wmyybb','/ddybb','/ddrbb','/wmcpxlb','/wmcpssb','/lsvideo','/lsxyqy','/cpyylb','/cpyylbadd','/cpyylbedit',"/wmsqms"],

    },

    subscriptions: {

    },

    effects: {
        // 退出登录
        *loginOut({ payload }, { select, call, put }) {

            const url = config.logoutUrl;
            const { data } = yield call(httpPost, url, payload);
            if (data) {
                if ((data.code) && (data.code == 200)) {
                    yield put(routerRedux.push({
                        pathname: '/login',
                    }));
                } else {
                    Message(data.msg);
                }
            }
        },
        *resetPwd({ payload }, { select, call, put }) {

            const url = config.updatePwdUrl;
            const { data } = yield call(httpPost, url, payload);
            if (data) {
                if ((data.code) && (data.code == 200)) {
                    yield put({
                        type: 'successHide'
                    });

                    yield put(routerRedux.push({
                        pathname: '/login',
                    }));

                } else {
                    yield put({
                        type: 'failInfo',
                        payload: {
                            msg: data.msg,
                        },
                    });
                }
            }
        },

        *queryRestaurantList({ payload }, { select, call, put }) {
            const url = config.choseRestaurantListUrl;
            const { data } = yield call(httpPostNoParam, url, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {

                    if (data.data) {

                        var allMenu = yield select(({ menu }) => menu.allMenu);

                        if (!data.data.brandList || data.data.brandList.length == 0) {

                            alert('当前没有门店')

                            return;
                        }

                        yield put({
                            type: 'updatePayload',
                            payload: {
                                currentRestaurantId: data.data.currentRestaurantId,
                                brandId: data.data.brandList[0].brandId,
                                realRestaurantName: data.data.currentRestaurantName,
                                brandList: data.data.brandList,
                                restaurantList: data.data.brandList[0].restaurantList,
                            },
                        });

                        yield put({
                            type: 'queryRestaurantInfo',
                            payload: {
                            },
                        });

                        var code;

                        allMenu.map((i) => {

                            if (localStorage.getItem('routename_currentPath') == i.resourceroute){

                                code = i.code

                            }else{
                                if (i.children) {
                                    i.children.map((j) => {

                                        if (j.children) {
                                            j.children.map((h) => {

                                                if (localStorage.getItem('routename_currentPath') == h.resourceroute) {

                                                    code = i.code;

                                                }
                                            })
                                        }

                                        if (localStorage.getItem('routename_currentPath') == j.resourceroute) {

                                            code = i.code;

                                        }
                                    })
                                }
                            }

                        })

                        if (!code) {

                            code = allMenu[0].code;
                        }

                        if (data.data.currentRestaurantId == 0 && data.data.count > 1 && code != 3 && code != 8 && code != 9) {

                            // localStorage.setItem('routename', 202);

                            yield put(routerRedux.push({
                                pathname: '/welcome',
                            }));

                        } else if (data.data.currentRestaurantId == 0 && data.data.count == 1) {

                            // localStorage.setItem('routename', 202);

                            yield put({
                                type: 'updatePayload',
                                payload: {
                                    brandId: data.data.brandList[0].brandId,
                                    restaurantId: data.data.brandList[0].restaurantList[0].restaurantId,
                                },
                            });

                            yield put({
                                type: 'queryChooseRestaurant',
                                payload: {

                                },
                            });

                        } else {

                            yield put({
                                type: 'updatePayload',
                                payload: {
                                    brandList: data.data.brandList,
                                    restaurantList: data.data.brandList[0].restaurantList,
                                },
                            });


                            var router = '';

                            if (localStorage.getItem('routename_currentPath') && isExist(localStorage.getItem('routename_currentPath'))) {

                                var left = [];
                                var head = [];
                                var second = [];
                                var openKeys = [];

                                allMenu.map((i) => {

                                    if (i.children) {
                                        i.children.map((j) => {

                                            if (j.children) {
                                                j.children.map((h) => {

                                                    if (localStorage.getItem('routename_currentPath') == h.resourceroute) {

                                                        left.push(h.code + '');
                                                        head.push(h.parentCode + '');
                                                        second = i.children;
                                                        openKeys.push(j.code + '');

                                                    }
                                                })
                                            }

                                            if (localStorage.getItem('routename_currentPath') == j.resourceroute) {

                                                left.push(j.code + '');
                                                head.push(j.parentCode + '');
                                                second = i.children;
                                                openKeys.push(i.code + '');

                                            }
                                        })
                                    }else {

                                        if (localStorage.getItem('routename_currentPath') == i.resourceroute) {

                                            left.push(i.code + '');
                                            head.push(i.parentCode + '');
                                        }
                                    }

                                })

                                if (left.length > 0) {

                                    yield put({
                                        type: 'updatePayload',
                                        payload: {
                                            leftSelectKeys: left,
                                            defaultHeaderMenu: head,
                                            secondMenu: second,
                                            openKeys: openKeys,
                                        }
                                    });

                                    yield put(routerRedux.push({
                                        pathname: localStorage.getItem('routename_currentPath'),
                                    }));
                                } else {

                                    var path = '';
                                    allMenu.map((i) => {

                                        if (i.children) {
                                            i.children.map((j) => {

                                                if (j.children) {
                                                    j.children.map((h) => {

                                                        if (localStorage.getItem('routename') + '' == h.code) {

                                                            left.push(h.code + '');
                                                            head.push(h.parentCode + '');
                                                            second = i.children;
                                                            openKeys.push(j.code + '');
                                                            path = h.resourceroute;

                                                        }
                                                    })
                                                }

                                                if (localStorage.getItem('routename') + '' == j.code) {

                                                    left.push(j.code + '');
                                                    head.push(j.parentCode + '');
                                                    second = i.children;
                                                    path = j.resourceroute;
                                                }
                                            })
                                        }else {

                                            if (localStorage.getItem('routename') + '' == i.code) {

                                                left.push(i.code + '');
                                                head.push(i.parentCode + '');
                                                path = i.resourceroute;
                                            }
                                        }

                                    })
                                    yield put({
                                        type: 'updatePayload',
                                        payload: {
                                            leftSelectKeys: left,
                                            defaultHeaderMenu: head,
                                            secondMenu: second,
                                            openKeys: openKeys,
                                        }
                                    });

                                    if (!path) {

                                        alert('当前没有菜单权限')
                                        return;

                                    }
                                    yield put(routerRedux.push({
                                        pathname: path,
                                    }));

                                }



                            } else {

                                var left = [];
                                var head = [];
                                var openKeys = [];

                                //一期先去掉权限
                                // left.push(data.data.powers[0].children[0].code + '');
                                // head.push(data.data.powers[0].code + '')

                                if (allMenu.length > 0 && !allMenu[0].children) {
                                    alert('当前没有菜单权限')
                                    return;

                                }
                                left.push(allMenu[0].children.length > 1 ? allMenu[0].children[1].code+'' : allMenu[0].children[0].code + '');
                                head.push(allMenu[0].code + '');
                                openKeys.push(allMenu[0].length > 1 ? allMenu[1].code+'' : allMenu[0].code + '')


                                yield put({
                                    type: 'updatePayload',
                                    payload: {
                                        leftSelectKeys: left,
                                        defaultHeaderMenu: head,
                                        openKeys: openKeys,
                                    }
                                });

                                allMenu.map((i) => {

                                    if (i.children) {
                                        i.children.map((j) => {

                                            if (j.children) {

                                                j.children.map((h) => {

                                                    if (h.code == left[0]) {

                                                        router = h.resourceroute;
                                                    }
                                                })

                                            }

                                            if (j.code == left) {

                                                router = j.resourceroute;

                                            }
                                        })
                                    }
                                })

                                yield put(routerRedux.push({
                                    pathname: router,
                                }));
                            }

                        }




                    }
                }

            }
        },

        *queryChooseRestaurant({ payload }, { select, call, put }) {
            const url = config.choseRestaurantUrl;

            let brandId = yield select(({ menu }) => menu.brandId);
            let restaurantId = yield select(({ menu }) => menu.restaurantId);
            const { data } = yield call(httpPostByIds, url, brandId, restaurantId);
            var restaurantName = yield select(({ menu }) => menu.restaurantName);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'queryRestaurantList',
                        payload: {

                        },
                    });

                    yield put({
                        type: 'updatePayload',
                        payload: {
                            realRestaurantName: restaurantName,
                            modalVisible: false,
                        },
                    });

                }
            }
        },

        *queryRestaurantInfo({ payload }, { select, call, put }) {
            const url = config.restaurantInfoUrl;

            let currentRestaurantId = yield select(({ menu }) => menu.currentRestaurantId);

            const { data } = yield call(httpPostWithId, url, payload, currentRestaurantId);

            if (data) {
                if (data.code == config.MSGCODE_SUCCESS && data.data) {

                    yield put({
                        type: 'cpdw/updatePayload',
                        payload: {
                            manageType: data.data.manageType,
                        },
                    });
                    yield put({
                        type: 'cpfl/updatePayload',
                        payload: {
                            manageType: data.data.manageType,
                        },
                    });
                    yield put({
                        type: 'cpxx/updatePayload',
                        payload: {
                            manageType: data.data.manageType,
                        },
                    });
                    yield put({
                        type: 'gggl/updatePayload',
                        payload: {
                            manageType: data.data.manageType,
                        },
                    });
                    yield put({
                        type: 'tcxx/updatePayload',
                        payload: {
                            manageType: data.data.manageType,
                        },
                    });
                    yield put({
                        type: 'zfgl/updatePayload',
                        payload: {
                            manageType: data.data.manageType,
                        },
                    });
                }
            }
        },
    },

    reducers: {
        initAccount(state, action) {
            return { ...state, ...action.payload };
        },
        getAccount(state, action) {
            return state.account;
        },
        initData(state, action) {
            var mainmenu = state.mainmenu;
            var returnmainmenu = action.payload.permission;
            var per = [];

            returnmainmenu.map((h, i) => {

                var hchecked = false;

                //if (h.checked == true && h.children) {
                if (h.children) {
                    h.children.map((s) => {
                        var schecked = false;

                        //if (s.checked == true && s.children) {
                        if (s.children) {

                            s.children.map((o) => {
                                if (o.checked == true) {
                                    per.push(o.code);
                                    schecked = true;
                                }
                            })

                        }

                        if (s.checked == true || schecked == true) {
                            per.push(s.code);
                            hchecked = true;
                        }
                    })
                }

                if (h.checked == true || hchecked == true) {
                    per.push(h.code);
                }
            })


            var res = [];

            var map = per;

            //遍历全量一级菜单
            mainmenu.map((h, i) => {
                //声明一级节点临时对象及子数组
                var resi = {};
                var peri = [];

                //遍历全量二级菜单
                if (mainmenu[i].children) {
                    mainmenu[i].children.map((s, j) => {
                        //声明二级节点临时对象及子数组
                        var resj = {};
                        var perj = [];

                        //遍历全量三级菜单
                        if (mainmenu[i].children[j].children) {
                            mainmenu[i].children[j].children.map((o, k) => {

                                if (map.indexOf(mainmenu[i].children[j].children[k].code) > -1) {
                                    //声明菜单元数据

                                    var resk = {};
                                    resk.name = mainmenu[i].children[j].children[k].name;
                                    resk.code = mainmenu[i].children[j].children[k].code;
                                    resk.parentCode = mainmenu[i].children[j].children[k].parentCode;
                                    resk.resourceroute = mainmenu[i].children[j].children[k].resourceroute;
                                    perj.push(resk);
                                }
                            })
                        };

                        if (perj.length > 0) {
                            resj.children = perj;
                        }

                        if (map.indexOf(mainmenu[i].children[j].code) > -1) {
                            resj.name = mainmenu[i].children[j].name;
                            resj.code = mainmenu[i].children[j].code;
                            resj.parentCode = mainmenu[i].children[j].parentCode;
                            resj.resourceroute = mainmenu[i].children[j].resourceroute;
                            //resj.img = mainmenu[i].children[j].img;
                            peri.push(resj);
                        }
                    })
                }

                if (peri.length > 0) {
                    resi.children = peri;
                }

                if (map.indexOf(mainmenu[i].code) > -1) {
                    resi.name = mainmenu[i].name;
                    resi.code = mainmenu[i].code;
                    resi.resourceroute = mainmenu[i].resourceroute;
                    resi.icontype = mainmenu[i].icontype;
                    res.push(resi);
                }
            })

            var myArray = new Array();
            myArray[0] = String(res[0].code);

            return { ...state, ...action.payload, allMenu: res, secondMenu: res[0].children, defaultHeaderMenu: myArray };
        },
        changeHeaderData(state, action) {

            const payload = action.payload;

            var currentKey = payload.currentItem.key;
            var secondList;
            var myArray = new Array();
            myArray[0] = String(currentKey);

            state.allMenu.map((h, i) => {
                if (h.code == currentKey) {
                    secondList = h.children
                }
            })

            return { ...state, ...action.payload, secondMenu: secondList, defaultHeaderMenu: myArray };
        },
        leftmenuClick(state, action) {

            const payload = action.payload;

            var currentKey = payload.currentItem.key;
            var myArray = new Array();
            myArray[0] = String(currentKey);

            return { ...state, leftSelectKeys: myArray };
        },
        updateLeftmenuSelectByRouter(state, action) {

            const { payload } = action;

            const { resourceroute } = payload;

            const { allMenu } = state;

            var headerSelectedKey = "";
            var leftSelectkey = "";
            var secondList = [];

            if (resourceroute) {
                //遍历全量一级菜单
                allMenu.map((h, i) => {

                    //遍历全量二级菜单
                    if (h.children) {
                        h.children.map((s, j) => {

                            //遍历全量三级菜单
                            if (s.children) {
                                s.children.map((o, k) => {
                                    if (resourceroute == o.resourceroute) {
                                        headerSelectedKey = h.code;
                                        leftSelectkey = o.code;
                                        secondList = h.children;
                                    }
                                })
                            } else {
                                if (resourceroute == s.resourceroute) {
                                    headerSelectedKey = h.code;
                                    leftSelectkey = s.code;
                                    secondList = h.children;
                                }

                            }
                        })
                    } else {

                        if (resourceroute == h.resourceroute) {
                            headerSelectedKey = h.code;
                            secondList = h.children;
                        }

                    }

                })

            }
            if (leftSelectkey) {
                var myArray = new Array();
                myArray[0] = String(leftSelectkey);
                var headerArray = new Array();
                headerArray[0] = String(headerSelectedKey);

                return { ...state, leftSelectKeys: myArray, secondMenu: secondList, defaultHeaderMenu: headerArray };

            } else {
                return { ...state };
            }

        },
        onOpenChange(state, action) {


            return { ...state, ...action.payload };
        },
        editpwdClick(state, action) {
            var maskstatus = 'block';
            return { ...state, ...action.payload, maskstatus: maskstatus };
        },
        closeMask(state, action) {
            var maskstatus = 'none';
            return { ...state, ...action.payload, maskstatus: maskstatus };
        },
        successHide(state, action) {
            var maskstatus = 'none';
            return { ...state, ...action.payload, maskstatus: maskstatus };
        },

        failInfo(state, action) {

            var ajaxstatus = 'block';

            return { ...state, ...action.payload, ajaxstatus: ajaxstatus };
        },
        onblurHide(state, action) {
            var ajaxstatus = 'none';
            return { ...state, ...action.payload, ajaxstatus: ajaxstatus };
        },
        updatePayload(state, action) {
            return { ...state, ...action.payload };
        },

    },

};

