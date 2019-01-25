import { httpPost } from '../../../services/HttpService';
import { config } from '../../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';



export default {
  namespace: 'yhqhdConfig',
  state: {
    resetForm: false, //重置form的标识
    total: 10, //数据总条数,默认初始为10条
    current: 1, //当前页码
    way: "",//标记是修改进入还是新增进入   
    offset: 0, //第几行开始
    size: 10, //请求行数
    viewVisible: false, //控制列表页显示详情的modal

    filterConditions: {      //列表中初始化过滤条件
      name: "",  // 优惠券名字,
      couponType: "",  //优惠券类型 ,
      status: "",  //优惠券状态 ,
    },
    dataSource: [], //优惠券列表数据
    isPushExpire: [], //初始化-微信提醒
    couponType: 1, //初始化-表单中优惠券类型,默认为1select模式
    couponMold: 1, //初始化-表单中切换优惠券种类radio模式
    periodValidityType: 1, //初始化-表单中有效日期类型select模式
    isDeductAll: 1, //初始化-菜品券模式下优惠金额radio发生改变模式,是否全部抵扣,1是0否
    notSuitableModalVisible: false, //控制不适用菜品modal框的显示与隐藏
    periodValidityFinish: "",  //初始化-有效期结束时间 ,
    periodValidityStart: "", //初始化-有效期开始时间 ,

    // 时间戳转换为时间的函数,因为这个确定是整点时间,所以我把时分秒部分固定死了
    formatDate: function (nows) {
      var now = new Date(nows);
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var date = now.getDate();
      var hour = now.getHours();
      var minute = now.getMinutes();
      var second = now.getSeconds();
      month = month >= 10 ? month : "0" + month;
      date = date >= 10 ? date : "0" + date;
      hour = hour >= 10 ? hour : "0" + hour;
      minute = minute >= 10 ? minute : "0" + minute;
      second = second >= 10 ? second : "0" + second;
      return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    },

    // cascaderOptions: [], //可用菜品级联选择框的可选源数据
    currentRecord: {}, //点击查看时存储当前数据
    restaurantData: [], //餐厅数据
    restaurantValue: [], //选中的餐厅数据

    foodData: [],//菜品数据
    foodValue: [], //多选选中的不可用菜品数据
    radioFood: [], //单选选中的可用菜品数据
    savePayloadData: {}, //存储保存接口的数据
    couponUseTimes: [],
    index:[1,1,1,1,1,1,1],
    timeArray:[[],[],[],[],[],[],[]],
    checkIndex:[1,1,1,1,1,1,1],

  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/yhqhdlist') {
          // 页面加载调用列表数据
          dispatch({
            type: 'query',
            payload: {},
          });

          // 调用品牌餐厅数据
          dispatch({
            type: 'getRestaurantData',
            payload: {},
          });
          // 调用菜品数据
          dispatch({
            type: 'getFoodData',
            payload: {},
          });
        }
        // 
        if (location.pathname === "/yhqhdeditform" || location.pathname === "/yhqhdform") {
          // 进入表单页时重置如下数据
          dispatch({
            type: "updatePayload",
            payload: {
              currentRecord: {}, //点击查看时存储当前数据
              restaurantValue: [], //选中的餐厅数据
              foodValue: [], //多选选中的不可用菜品数据
              radioFood: [], //单选选中的可用菜品数据
              savePayloadData:{}
            }
          })
        }

        // 编辑表单
        if (location.pathname === '/yhqhdeditform') {
          // 用路由带过来的id调取接口
          if (location.query.id) {
            dispatch({
              type: 'getCurrentDetailData',
              payload: { id: location.query.id },
            });
          }
        }
      });
    },

  },

  effects: {
    //请求列表数据,按条件请求列表数据都走这一个接口
    *query({ payload }, { select, call, put }) {
      const orderListUrl = config.yhqhdListUrl;
      // 获取请求参数
      let offset = yield select(({ yhqhdConfig }) => yhqhdConfig.offset);  //第几行开始
      let size = yield select(({ yhqhdConfig }) => yhqhdConfig.size);       //请求几行
      let name = yield select(({ yhqhdConfig }) => yhqhdConfig.filterConditions.name); //优惠券名称
      let status = yield select(({ yhqhdConfig }) => yhqhdConfig.filterConditions.status); //状态
      let couponType = yield select(({ yhqhdConfig }) => yhqhdConfig.filterConditions.couponType); //优惠券类型

      payload.offset = offset;
      payload.size = size;
      payload.name = name;
      payload.status = status;
      payload.couponType = couponType;

      const { data } = yield call(httpPost, orderListUrl, payload);
      if (data) {
        if (data.code == config.MSGCODE_SUCCESS) {
          yield put({
            type: 'updatePayload',
            payload: {
              dataSource: data.data,
              total: data.totalCount
            }
          });
        } else {
          message.error(data.msg);
        }
      }
    },
    // // 列表页面禁用/启用账户
    * changeYhqStatus({ payload }, { select, call, put }) {
      const orderListUrl = config.changeYhqStatusUrl + payload.id + "/" + payload.goalStatus;
      const { data } = yield call(httpPost, orderListUrl, {});
      if (data) {
        if (data.code == config.MSGCODE_SUCCESS) {
          message.success("修改成功!")
          // 成功后重新请求列表数据
          yield put({
            type: 'query',
            payload: {
            }
          });
        } else {
          message.error(data.msg);
        }
      }
    },
    // 添加优惠券/修改优惠券接口
    *addYhq({ payload }, { select, call, put }) {
      const orderListUrl = config.addYhqUrl
      const { data } = yield call(httpPost, orderListUrl, payload);
      if (data) {
        if (data.code == config.MSGCODE_SUCCESS) {
          console.log(payload)
          message.success("保存成功!")
          // 跳转到列表页
          yield put(routerRedux.push({
            pathname: '/yhqhdlist',
            query: {},
          }));
        } else {
          message.error(data.msg);
          console.log(data.msg);
        }
      }
    },
    // 点击列表页查看获取列表页单条优惠券的详情
    *getYhqDetail({ payload }, { select, call, put }) {
      const orderListUrl = config.getYhqDetailUrl + payload.id;
      const { data } = yield call(httpPost, orderListUrl, payload);

      if (data) {
        if (data.code == config.MSGCODE_SUCCESS) {
          let currentRecord = data.data;
          yield put({
            type: "updatePayload",
            payload: { currentRecord }
          })

        } else {
          message.error(data.msg);
          console.log(data.msg);
        }
      }
    },

    // 点击列表页编辑获取当前id对应的优惠券详情用于编辑优惠券
    *getCurrentDetailData({ payload }, { select, call, put }) {
      const orderListUrl = config.getYhqDetailUrl + payload.id;
      const { data } = yield call(httpPost, orderListUrl, payload);

      if (data) {
        if (data.code == config.MSGCODE_SUCCESS) {
          let currentRecord = data.data;

          // 循环展示餐厅数据
          let restaurantData = yield select(({ yhqhdConfig }) => yhqhdConfig.restaurantData); //餐厅数据
          let restaurantValue = []; //初始化返回的选中餐厅数据

          if (!data.data.applicableRestaurants){
              data.data.applicableRestaurants = [];
          }
          if (data.data.applicableRestaurants.length > 0 && restaurantData.length > 0) {
            data.data.applicableRestaurants.map(function (item, index) {
              restaurantValue.push(`${item.brandId}-${item.restaurantId}`)
            })
          }

          // 菜品券时展示适用的菜品
          let radioFood;
          if (data.data.couponType == 2) {
            radioFood = [data.data.foodBrandId.toString(), `${data.data.foodBrandId}-${data.data.foodCategoryId}`, `${data.data.foodBrandId}-${data.data.foodCategoryId}-${data.data.foodId}-${data.data.foodType}`]
          }

          // 代金券时展示不可用菜品
          let foodValue = [];
          if (data.data.unapplicableFoods && data.data.unapplicableFoods != "" && data.data.unapplicableFoods != null && data.data.unapplicableFoods.length > 0) {
            data.data.unapplicableFoods.map(function (item) {
              foodValue.push(`${item.brandId}-${item.foodCategoryId}-${item.foodId}-${item.foodType}`)
            })
          }


          yield put({
            type: "updatePayload",
            payload: {
              currentRecord,
              couponType: currentRecord.couponType, //优惠券类型select模式
              couponMold: currentRecord.couponMold,//优惠券种类radio模式
              isPushExpire: [currentRecord.isPushExpire], //到期提醒
              isDeductAll: currentRecord.isDeductAll, //是否全部抵扣,1是0否
              periodValidityType: currentRecord.periodValidityType, //有效日期类型select模式
              periodValidityFinish: currentRecord.periodValidityFinish,  //初始化-有效期结束时间 ,
              periodValidityStart: currentRecord.periodValidityStart, //初始化-有效期开始时间 ,
              restaurantValue, //选中的适用餐厅集合
              radioFood,//选中的适用菜品
              foodValue, //选中的不适用菜品集合
            }
          })

            let newIndex = [1,1,1,1,1,1,1];
            let newTimeArray = [[],[],[],[],[],[],[]];
            let newCheckIndex = [0,0,0,0,0,0,0];

            data.data && data.data.couponUseTimes && data.data.couponUseTimes.length >0 && data.data.couponUseTimes.map((i)=>{

                if (i.week == 1){
                    newCheckIndex[1] = 1;
                }else if (i.week == 2){
                    newCheckIndex[2] = 1;
                }else if (i.week == 3){
                    newCheckIndex[3] = 1;
                }else if (i.week == 4){
                    newCheckIndex[4] = 1;
                }else if (i.week == 5){
                    newCheckIndex[5] = 1;
                }else if (i.week == 6){
                    newCheckIndex[6] = 1;
                }else if (i.week == 0){
                    newCheckIndex[0] = 1;
                }


            })

            yield put({
                type: "updatePayload",
                payload: {
                    checkIndex:newCheckIndex,
                }
            })

            data.data && data.data.couponUseTimes && data.data.couponUseTimes.length >0 && data.data.couponUseTimes.map((i)=>{

                if (i.week == 1){
                    if (i.weekType  == 1){
                        newIndex[1]= 1;
                    }else{
                        newIndex[1]= 2;
                    }
                }else if (i.week == 2){
                    if (i.weekType  == 1){
                        newIndex[2]= 1;
                    }else{
                        newIndex[2]= 2;
                    }
                }else if (i.week == 3){
                    if (i.weekType  == 1){
                        newIndex[3]= 1;
                    }else{
                        newIndex[3]= 2;
                    }
                }else if (i.week == 4){
                    if (i.weekType  == 1){
                        newIndex[4]= 1;
                    }else{
                        newIndex[4]= 2;
                    }
                }else if (i.week == 5){
                    if (i.weekType  == 1){
                        newIndex[5]= 1;
                    }else{
                        newIndex[5]= 2;
                    }
                }else if (i.week == 6){
                    if (i.weekType  == 1){
                        newIndex[6]= 1;
                    }else{
                        newIndex[6]= 2;
                    }
                }else if (i.week == 0){
                    if (i.weekType  == 1){
                        newIndex[0]= 1;
                    }else{
                        newIndex[0]= 2;
                    }
                }


            })

            yield put({
                type: "updatePayload",
                payload: {
                    index:newIndex,
                }
            })

            data.data && data.data.couponUseTimes && data.data.couponUseTimes.length >0 && data.data.couponUseTimes.map((i)=>{

                if (i.week == 1){
                    newTimeArray[1] = i.applicableUseTimes?i.applicableUseTimes:[];
                }else if (i.week == 2){
                    newTimeArray[2] = i.applicableUseTimes?i.applicableUseTimes:[];
                }else if (i.week == 3){
                    newTimeArray[3] = i.applicableUseTimes?i.applicableUseTimes:[];
                }else if (i.week == 4){
                    newTimeArray[4] = i.applicableUseTimes?i.applicableUseTimes:[];
                }else if (i.week == 5){
                    newTimeArray[5] = i.applicableUseTimes?i.applicableUseTimes:[];
                }else if (i.week == 6){
                    newTimeArray[6] = i.applicableUseTimes?i.applicableUseTimes:[];
                }else if (i.week == 0){
                    newTimeArray[0] = i.applicableUseTimes?i.applicableUseTimes:[];
                }


            })

            yield put({
                type: "updatePayload",
                payload: {
                    timeArray:newTimeArray,
                }
            })

        } else {
          message.error(data.msg);
          console.log(data.msg);
        }
      }
    },

    // 获取品牌和餐厅数据
    *getRestaurantData({ payload }, { select, call, put }) {
      const orderListUrl = config.storeUrl;
      const { data } = yield call(httpPost, orderListUrl, payload);
      if (data) {
        if (data.code == config.MSGCODE_SUCCESS) {
          let restaurantData = [];
          if (data.data.length > 0) {
            data.data.map(function (item, index) {
              restaurantData.push({
                label: item.name,
                value: item.id.toString(),
                key: item.id.toString(),
                children: []
              })

              if (item.restaurants.length > 0) {
                item.restaurants.map(function (ele) {
                  restaurantData[index].children.push({
                    label: ele.name,
                    value: `${item.id}-${ele.id}`,
                    key: `${item.id}-${ele.id}`
                  })
                })
              } else {
                restaurantData[index].disabled = true;
              }
            })
          }
          yield put({
            type: "updatePayload",
            payload: { restaurantData }
          })
        } else {
          message.error(data.msg);
          console.log(data.msg);
        }
      }
    },

    // 获取菜品数据
    *getFoodData({ payload }, { select, call, put }) {
      const orderListUrl = config.foodUrl;
      const { data } = yield call(httpPost, orderListUrl, payload);

      if (data) {
        if (data.code == config.MSGCODE_SUCCESS) {
          // console.log(data)
          let foodData = [];
          if (data.data.length > 0) {

            data.data.map(function (item, index) {
              // 循环拿到一级
              foodData.push({
                label: item.brandName,
                value: item.brandId.toString(),
                key: item.brandId.toString(),
                children: []
              })

              if (item.categories && item.categories != "" && item.categories != null && item.categories.length > 0) {
                item.categories.map(function (ele, inde) {
                  // 循环拿到二级
                  foodData[index].children.push({
                    label: ele.categoryName,
                    value: `${item.brandId}-${ele.categoryId}`,
                    key: `${item.brandId}-${ele.categoryId}`,
                    children: [],
                  })
                  // 循环拿到三级
                  if (ele.foods && ele.foods != "" && ele.foods != null && ele.foods.length > 0) {
                    ele.foods.map(function (el, ind) {
                      foodData[index].children[inde].children.push({
                        label: el.name,
                        value: `${item.brandId}-${ele.categoryId}-${el.id}-${el.foodType}`,
                        key: `${item.brandId}-${ele.categoryId}-${el.id}-${el.foodType}`,
                      })
                    })
                  } else {
                    foodData[index].children[inde].disabled = true;
                  }
                })
              } else {
                foodData[index].disabled = true;
              }
            })
          }

          // console.log(foodData)


          yield put({
            type: "updatePayload",
            payload: { foodData }
          })





        } else {
          message.error(data.msg);
          console.log(data.msg);
        }
      }
    },
    // 请求查询输入优惠券的名称的出现次数
    *checkNameIsRepeat({ payload }, { select, call, put }) {
      const orderListUrl = config.checkNameIsRepeatUrl + "/" + payload.name + "/" + payload.id;
      let savePayloadData = yield select(({ yhqhdConfig }) => yhqhdConfig.savePayloadData); //获取保存接口需要的保存数据
      const { data } = yield call(httpPost, orderListUrl, {});
      if (data) {
        if (data.code == config.MSGCODE_SUCCESS) {
          console.log(data)

          if (data.data > 0) {
            message.error("优惠券名称已存在!")
            return
          } else if (data.data == 0 && savePayloadData.name) {
            // 调用保存接口
            console.log("可以调用接口")
            yield put({
              type: "addYhq",
              payload: savePayloadData
            })


          }

        } else {
          message.error(data.msg);
          console.log(data.msg);
        }
      }
    },
  },
  reducers: {
    updatePayload(state, action) {
      return { ...state, ...action.payload, };
    },

  }
}