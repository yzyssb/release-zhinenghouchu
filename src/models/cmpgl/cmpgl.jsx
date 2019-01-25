import { httpPost } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';



export default {
  namespace: 'cmpglPageConfig',
  state: {
    visible: false,
    way: "", //是修改还是新增
    current: 1,
    totalCount: 10, //记录一共有多少条数据,默认给个十条
    pageForm: {
      offset: 0, //起始行数
      size: 10 //每页数量,一进页面默认请求第一页的数量
    },
    //需要重置form标识
    isResetForm: false,
    dataSource: [], //存储触摸屏信息列表数据
    // 处理时间的函数
    formatDateTime: function (inputTime) {
      var date = new Date(inputTime);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? ('0' + m) : m;
      var d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      var h = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      var minute = date.getMinutes();
      var second = date.getSeconds();
      minute = minute < 10 ? ('0' + minute) : minute;
      second = second < 10 ? ('0' + second) : second;
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    },
    editData: {
      companyId: "", // 商户id ,
      id: "", // 主键id ,
      isPrintReceipt: 1, // 是否打印小票 ，1 是 2否 ,
      printerIp: "", // 对应打印机 ,
      restaurantId: "", //商家id ,
      restaurantName: "", // 商户名称 ,
      state: 1, //是否可用 1可以，2不可用,
      touchscreenIp: "", // IP地址 ,
      touchscreenName: "",// 触摸屏名称 ,
      touchscreenType: 1,// 传菜触摸屏类型 触摸屏类型，1 传菜端 2厨师端 3撤台端
    },
    defaultEditData: function () {
      return {
        companyId: "", // 商户id ,
        id: "", // 主键id ,
        isPrintReceipt: 1, // 是否打印小票 ，1 是 2否 ,
        printerIp: "", // 对应打印机 ,
        restaurantId: "", //商家id ,
        restaurantName: "", // 商户名称 ,
        state: 1, //是否可用 1可以，2不可用,
        touchscreenIp: "", // IP地址 ,
        touchscreenName: "",// 触摸屏名称 ,
        touchscreenType: 1,// 传菜触摸屏类型 触摸屏类型，1 传菜端 2厨师端 3撤台端
      }
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/cmpgl'||location.pathname==='/znhc') {
          dispatch({
            type: 'query',
            payload: {},
          });
        }
      });
    },

  },

  effects: {
    //请求列表数据
    *query({ payload }, { select, call, put }) {
      const orderListUrl = config.touchListUrl;
      payload = yield select(({ cmpglPageConfig }) => cmpglPageConfig.pageForm);
      const { data } = yield call(httpPost, orderListUrl, payload);
      if (data) {
        if (data.code == config.MSGCODE_SUCCESS) {
          

          // 更新数据
          yield put({
            type: 'updatePayload',
            payload: {
              dataSource: data.data,
              totalCount: data.totalCount
            }
          });

        } else {
          message.error(data.msg);

          console.log(data.msg);
        }
      } else {
        message.error(data.msg);

        console.log(data.msg);
      }
    },

    // 删除触摸屏信息列表数据
    * delCmpglList({ payload }, { select, call, put }) {
      const orderListUrl = config.deltouchUrl + payload.id;
      
      const { data } = yield call(httpPost, orderListUrl, {});
      if (data) {
        if (data.code == config.MSGCODE_SUCCESS) {
          
          // 删除成功后重新请求第一页的数据

          let pageForm = {
            offset: 0, //起始行数
            size: 10 //每页数量,一进页面默认请求第一页的数量 
          }

          yield put({
            type: 'updatePayload',
            payload: { pageForm, current: 1 }
          });

          // 更新数据
          yield put({
            type: 'query',
            payload: {}
          });

        } else {
          message.error(data.msg);
          console.log(data.msg);
        }
      }
    },

    // 触摸屏信息列表点击列表中的某一项进入修改保存
    * editCmpglList({ payload }, { select, call, put }) {

      let id = yield select(({ cmpglPageConfig }) => cmpglPageConfig.editData.id);
      
      const orderListUrl = config.editTouchUrl + id;
      const { data } = yield call(httpPost, orderListUrl, payload);
      if (data) {
        if (data.code == config.MSGCODE_SUCCESS) {
          // 更新成功后重新请求数据
          let pageForm = {
            offset: 0, //起始行数
            size: 10 //每页数量,一进页面默认请求第一页的数量 
          }
          yield put({
            type: 'updatePayload',
            payload: { pageForm, current: 1 }
          });
          // 更新数据
          yield put({
            type: 'query',
            payload: {}
          });
          
          /*yield put(routerRedux.push({
            pathname: "/cmpgl",
            query: {
              type: 'cmpgl',
            }
          }));*/
          window.history.go(-1)

        } else {
          message.error(data.msg);
          console.log(data.msg);
        }
      }
    },

    // 添加触摸屏类型
    *  addTouchList({ payload }, { select, call, put }) {
      const orderListUrl = config.addTouchListUrl
      const { data } = yield call(httpPost, orderListUrl, payload);
      if (data) {
        if (data.code == config.MSGCODE_SUCCESS) {
          let pageForm = {
            offset: 0, //起始行数
            size: 10 //每页数量,一进页面默认请求第一页的数量 
          }

          yield put({
            type: 'updatePayload',
            payload: { pageForm, current: 1 }
          });

          // 更新数据
          yield put({
            type: 'query',
            payload: {}
          });

          /*yield put(routerRedux.push({
            pathname: "/cmpgl",
            query: {}
          }));*/
          window.history.go(-1)



        } else {
          message.error(data.msg);
          console.log(data.msg);
        }
      }
    },


  },


  //  触摸屏信息列表 删除按钮

  reducers: {
    updatePayload(state, action) {
      return { ...state, ...action.payload, };
    },
  }
}