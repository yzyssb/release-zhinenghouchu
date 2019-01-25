import { httpPost, httpPostWithId, httpPostWithOnlyId } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import message from "antd/lib/message/index";

const todaystart = moment().startOf("day");
const todayend = moment().endOf("day");


export default {
  namespace: 'cpfjfEditConfig',
  state: {
    // isResetForm:false,//标识重置表单
    currentDataDetail: {}, //存储当前数据
    currentId: "", //存储当前id
    timeRadio: 1, //掌控时间类型显示哪一个
    activity_starttime: "", //活动开始时间,字符串格式
    activity_endtime: "", //活动结束时间,字符串格式
    in_week: [], //固定星期几
    offset: 0,  //列表请求第几行页的数据
    size: 10000, //请求几行的数据

    storeList: [], //门店列表数据
    storeModalVisible: false, //门店modal展示与隐藏
    storeInitSelectedRowKeys: [], //初始要展示在页面中的值
    storeSelectedRowKeys: [], //默认选中的项和临时存储选中的项
    storeids: "", //适用门店

    goodList: [], //食物列表数据
    goodModalVisible: false, //食物modal展示与隐藏
    goodInitSelectedRowKeys: [], //初始要展示在页面中的值
    goodSelectedRowKeys: [], //默认选中的项和临时存储选中的项
    goodids: "", //产品名称
    memberTakeIn: "",//会员参与活动
    dismemberTakeIn: "",//非会员参与活动

    getFieldsValue: {}, //存储所有要保存的数据



  },
  subscriptions: {

    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/cpfjfeditform') {
          // 用拿到的id去请求详情数据
          dispatch({
            type: 'getDetail',
            payload: { id: location.query.id },
          });

          // 请求食物列表数据
          dispatch({
            type: 'getFoodList',
            payload: {},
          });

          // 请求门店列表数据
          dispatch({
            type: 'getStoreList',
            payload: {},
          });


        }
      });
    },




  },
  effects: {
    // 一进页面获取详情数据
    *getDetail({ payload }, { select, call, put }) {
      const orderListUrl = config.getActivity;
      const { data } = yield call(httpPost, orderListUrl, payload);
      if (data) {
        if (data.code == config.MSGCODE_SUCCESS) {
          // 把产品的字符串转为数组的形式
          let initGoodIdsnew = [];
          data.data.goodIdsnew.split(",").map(function (item, index) {
            initGoodIdsnew.push(Number(item))
          })

          // 把店铺的字符串转为数组的形式
          let initStoreIdsnew = [];
          data.data.storeIdsnew.split(",").map(function (item, index) {
            initStoreIdsnew.push(Number(item))
          })

          // 处理拿到in_week
          let in_week = [];

          if (data.data.inWeek && data.data.inWeek != "") {
            in_week = data.data.inWeek.split(",");
          } else {
            in_week = []
          }

                  // 更新数据
          yield put({
            type: 'updatePayload',
            payload: {
              currentDataDetail: data.data,

              storeInitSelectedRowKeys: initStoreIdsnew, //初始要展示在页面中的值
              storeSelectedRowKeys: initStoreIdsnew, //默认选中的项和临时存储选中的项
              storeids: data.data.storeids, //展示在页面中的门店名称

              goodInitSelectedRowKeys: initGoodIdsnew, //选中的产品ids
              goodSelectedRowKeys: initGoodIdsnew, //选中的产品ids
              goodids: data.data.goodids, //选中的产品的名字

              memberTakeIn: data.data.memberTakeIn,//会员参与活动
              dismemberTakeIn: data.data.dismemberTakeIn,//非会员参与活动

              in_week: in_week, //把固定星期几由字符串转为数组,用于渲染页面
              in_day: data.data.inDay, //存储日子
            }
          });

          // 初始化展示哪一个时间类型
          if (data.data.inDay) {
            yield put({
              type: 'updatePayload',
              payload: {
                timeRadio: 1,
              }
            });
          } else if (data.data.inWeek) {
            yield put({
              type: 'updatePayload',
              payload: {
                timeRadio: 2,
              }
            });
          } else if (data.data.activityEndtime && data.data.activityStarttime) {
            yield put({
              type: 'updatePayload',
              payload: {
                timeRadio: 3,
                activity_starttime: data.data.activityStarttime,
                activity_endtime: data.data.activityEndtime
              }
            });
          }


        } else {
          message.error(data.msg);
          console.log(data.msg);
        }
      }
    },

    // 请求食物列表
    *getFoodList({ payload }, { select, call, put }) {
      const orderListUrl = config.foodListUrl;
      payload.offset = yield select(({ cpfjfEditConfig }) => cpfjfEditConfig.offset);
      payload.size = yield select(({ cpfjfEditConfig }) => cpfjfEditConfig.size);
      const { data } = yield call(httpPost, orderListUrl, payload);
      if (data) {
        yield put({ type: 'getSuccess', payload: { payload } });
        if (data.code == config.MSGCODE_SUCCESS) {
          yield put({
            type: 'updatePayload',
            payload: {
              goodList: data.data,
            },
          });
        } else {
          message.warning(data.msg);
        }
      }
    },

    // 获取门店列表
    *getStoreList({ payload }, { select, call, put }) {
      yield put({ type: 'showLoading' });
      const storeListUrl = config.storeListUrl;
      // 不传参,不分页
      const { data } = yield call(httpPost, storeListUrl, {});
      if (data) {
        if (data.code == config.MSGCODE_SUCCESS) {
          yield put({
            type: 'updatePayload',
            payload: {
              storeList: data.data.shopList,
            },
          });
        } else {
          message.warning(data.msg);
        }
      }
    },

    // 保存修改
    *saveEdit({ payload }, { select, call, put }) {
      const orderListUrl = config.saveEditUrl;
      // 编辑请求参数
      payload.activity_name = yield select(({ cpfjfEditConfig }) => cpfjfEditConfig.getFieldsValue.activity_name);// 活动名称,

      // 根据timeRadio确定时间类型,确定传什么参数, timeRadio=1 固定日期  timeRadio=2固定星期几  timeRadio=3时间段临时活动
      let timeRadio = yield select(({ cpfjfEditConfig }) => cpfjfEditConfig.timeRadio);
      if (timeRadio == 1) {
        payload.in_day = yield select(({ cpfjfEditConfig }) => cpfjfEditConfig.getFieldsValue.in_day); // 固定天数
        payload.in_week = "";  //固定星期几 周日周一~周六分别对应1\2~7
        payload.activity_endtime = ""; // 活动结束时间,
        payload.activity_starttime = ""; // 活动开始时间,
      } else if (timeRadio == 2) {
        payload.in_day = "";// 固定天数

        // 需要把in_week数组拼接为字符串的形式
        let in_week = yield select(({ cpfjfEditConfig }) => cpfjfEditConfig.getFieldsValue.in_week); //固定星期几 周日周一~周六分别对应1\2~7
        payload.in_week = "";
        in_week.map(function (item, index) {
          payload.in_week += item + ","
        })

        payload.activity_endtime = ""; // 活动结束时间,
        payload.activity_starttime = ""; // 活动开始时间,
      } else if (timeRadio == 3) {
        payload.in_day = ""; // 固定天数
        payload.in_week = ""; //固定星期几 周日周一~周六分别对应1\2~7
        payload.activity_endtime = yield select(({ cpfjfEditConfig }) => cpfjfEditConfig.activity_endtime); // 活动结束时间,
        payload.activity_starttime = yield select(({ cpfjfEditConfig }) => cpfjfEditConfig.activity_starttime); // 活动开始时间,
      }

      // 合适的门店ids,需要把装着门店ids拼接为字符串的形式 ,storeInitSelectedRowKeys
      let storeids = "";
      let storeInitSelectedRowKeys = yield select(({ cpfjfEditConfig }) => cpfjfEditConfig.storeInitSelectedRowKeys);
      storeInitSelectedRowKeys.map(function (item, index) {
        storeids += item + ",";
      })
      payload.storeids = storeids; //门店id串(1, 2)


      // 合适的产品ids,需要把装着产品ids拼接为字符串的形式 ,storeInitSelectedRowKeys
      let goodids = "";
      let goodInitSelectedRowKeys = yield select(({ cpfjfEditConfig }) => cpfjfEditConfig.goodInitSelectedRowKeys);
      goodInitSelectedRowKeys.map(function (item, index) {
        goodids += item + ",";
      })
      payload.goodids = goodids; //产品id串(1, 2)


      // 会员是否参与活动,如果不参与,直接把活动比例改为0;
      payload.member_take_in = yield select(({ cpfjfEditConfig }) => cpfjfEditConfig.getFieldsValue.member_take_in);
      if (payload.member_take_in == 1) {  //会员参与活动
        payload.mem_count = yield select(({ cpfjfEditConfig }) => cpfjfEditConfig.getFieldsValue.mem_count);
      } else { //会员不参与活动
        payload.mem_count = 0;
      }

      // 非会员是否参与活动,如果不参与,直接把活动比例改为0;
      payload.dismember_take_in = yield select(({ cpfjfEditConfig }) => cpfjfEditConfig.getFieldsValue.dismember_take_in);
      if (payload.dismember_take_in == 1) {  //非会员参与活动
        payload.dis_count = yield select(({ cpfjfEditConfig }) => cpfjfEditConfig.getFieldsValue.dis_count);
      } else { //非会员不参与活动
        payload.dis_count = 0;
      }

      payload.id = yield select(({ cpfjfEditConfig }) => cpfjfEditConfig.currentDataDetail.id);// 活动Id（添加没有，修改则有）,
      payload.state = yield select(({ cpfjfEditConfig }) => cpfjfEditConfig.currentDataDetail.state);// 状态（1启用 2停用）,远洋返回即可
      payload.ruleType = 10; // // 活动类型,固定传10,
      console.log(payload)
      const { data } = yield call(httpPost, orderListUrl, payload);
      if (data) {
        if (data.code == config.MSGCODE_SUCCESS) {
          message.success("修改成功!");

          // 跳转页面到列表页
          yield put(routerRedux.push({
            pathname: '/cpfjf',
            query: {},
          }));

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