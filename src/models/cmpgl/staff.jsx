import { httpPost } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';



export default {
  namespace: 'cmpglPageStaffConfig',
  state: {
    //需要重置form标识
    isResetForm: false,
    dataSource: [], //存储触摸屏信息列表数据
    query: "",  //接收传过来的参数
    visible: false,  //控制modal的显示与隐藏
    modalData: [], //Modal列表请求来的数据，一进页面就请求到了
    resultData: [], //每次点击选择店员，比较dataSource和modalData得到的
    selectedRowKeys: [], // 存储modal列表中用户选中项目的index，是一个数组
    selectedRows: [] //存储modal中选中的项目
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/setStaff') {
          // 拿到传过来的参数并存储
          dispatch({
            type: 'updatePayload',
            payload: { query: location.query }
          });

          // 得到id后调用list请求
          dispatch({
            type: 'query',
            payload: {}
          });

          //请求madal列表中的数据 
          dispatch({
            type: 'getModalList',
            payload: {}
          });


        }
      });
    },

  },

  effects: {
    //根据id请求员工列表数据
    *query({ payload }, { select, call, put }) {
      let id = yield select(({ cmpglPageStaffConfig }) => cmpglPageStaffConfig.query.id);
      const orderListUrl = config.useIdGetStaffList + id;

      const { data } = yield call(httpPost, orderListUrl, {});
      if (data) {
        if (data.code == config.MSGCODE_SUCCESS) {
          console.log(data.data)
          // 更新数据
          yield put({
            type: 'updatePayload',
            payload: {
              dataSource: data.data,
            }
          });

        } else {
          message.error(data.msg);
          console.log(data.msg);
        }
      }
    },
    // 请求modal中的员工列表，不分页请求
    *getModalList({ payload }, { select, call, put }) {
      const orderListUrl = config.getModalStaffList;
      const { data } = yield call(httpPost, orderListUrl, {});
      if (data) {
        if (data.code == config.MSGCODE_SUCCESS) {
          // 把去重后的数据放到Modal框中
          yield put({
            type: 'updatePayload',
            payload: {
              modalData: data.data,
            }
          });
        } else {
          message.error(data.msg);
          console.log(data.msg);
        }
      }
    },
    // addModalStaffToList
    *addStaffs({ payload }, { select, call, put }) {
      const orderListUrl = config.addModalStaffToList;
      const { data } = yield call(httpPost, orderListUrl, payload);
      if (data) {
        if (data.code == config.MSGCODE_SUCCESS) {
          //成功后重新请求当前触摸屏id的员工列表
          yield put({
            type: 'query',
            payload: {
            }
          });
        } else {
          message.error(data.msg);
          console.log(data.msg);
        }
      }
    },
    // 删除员工管理中触摸屏下对应的员工
    *  delStaff({ payload }, { select, call, put }) {
      const orderListUrl = config.delStaffData + payload.touchscreenId + "/" +payload.id;
      console.log(orderListUrl)
      const { data } = yield call(httpPost, orderListUrl, {});
      if (data) {
        if (data.code == config.MSGCODE_SUCCESS) {
          console.log(data)
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
  },
  //  触摸屏信息列表 删除按钮
  reducers: {
    updatePayload(state, action) {
      return { ...state, ...action.payload, };
    },
  }
}