import { httpPost } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';




export default {
  namespace: 'zfglPageConfig',
  state: {
    dataSource: [], //装页面中时时展示的数据
    totalCount: 10, //记录一共有多少条数据
    current: 1, //pagation分页器用户可见的当前页数
    // allowSubmit: false, //开关不让重复提交的
    // 请求列表数据data
    
    offset: 0, //起始行数
    size: 10, //每页数量,一进页面默认请求第一页的数量
   
    checkName: 0, //0不存在重复，1存在重复的
    //需要重置form标识
    isResetForm: false,
    way: "",//记录ZfglPageForm页面展示时是从新增入口进的还是从修改入口进的add新增入口，edit修改入口
    editData: {
      payMethodTypeName: "", //支付方式
      id: "",   //数据库主键
      companyId: 0,    //'集团id,必须为数值0' 
      restaurantId: 0,   //'餐厅id，必须为数值0',
      payMethodType: "1",    //'0 现金 1银行卡支付 2优惠券 4会员  8第三方 6微信
      payMethodName: "",   // '支付名称',
      remark: "", // '备注',
      gmtCreate: "", // '创建时间,目前用不上',
      gmtModified: "", // '最后修改时间，目前用不上',
      state: 1, // '状态  0 停用  1 启用',
      isUsePoint: 1, // '是否使用积分 1启用  0不启用',
      // couponValue: 0, // '劵面值'（只有优惠券时传值，注意是数值，其他方式下不传此字段）
      // actualCouponValue: 0, // '劵实收'（只有优惠券时传值，注意是数值，其他方式下不传此字段）
      channel: 1,   // 渠道
      merchantNumber: "", // 商户号
      apiKey: "", // 支付api key
      appid: "",  // 公众号appid
      secret: "", // 公众号secret
      cert: "",
    },
    // 重置editData时调用此函数
    restoresData: function () {
      return {
        payMethodTypeName: "", //支付方式
        id: "",   //数据库主键
        companyId: 0,    //'集团id,必须为数值0' 
        restaurantId: 0,   //'餐厅id，必须为数值0',
        payMethodType: "1",   //'0 现金 1银行卡支付 2优惠券 4会员  8第三方 6微信
        payMethodName: "",   // '支付名称',
        remark: "", // '备注',
        gmtCreate: "", // '创建时间,目前用不上',
        gmtModified: "", // '最后修改时间，目前用不上',
        state: 1, // '状态  0 停用  1 启用',
        isUsePoint: 1, // '是否使用积分 1启用  0不启用',
        // couponValue: 0, // '劵面值'（只有优惠券时传值，注意是数值，其他方式下不传此字段）
        // actualCouponValue: 0, // '劵实收'（只有优惠券时传值，注意是数值，其他方式下不传此字段）
        channel: 1,   // 渠道
        merchantNumber: "", // 商户号
        apiKey: "", // 支付api key
        appid: "",  // 公众号appid
        secret: "", // 公众号secret
        cert: "",
      }
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/zfgl') {
          // console.log(location.query)
          // 页面加载调用列表数据
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
      const orderListUrl = config.getpayListUrl;
      payload.offset = yield select(({ zfglPageConfig }) => zfglPageConfig.offset);
      payload.size = yield select(({ zfglPageConfig }) => zfglPageConfig.size);
      const { data } = yield call(httpPost, orderListUrl, payload);
      
      if (data) {
        if (data.code == config.MSGCODE_SUCCESS) {
          // 更新页面中的数据

          yield put({
            type: 'updatePayload',
            payload: {
              dataSource: data.data,
              total: data.totalCount
            }
          });

        } else {
          message.error(data.msg);
          console.log(data.msg);
        }
      }
    },

    // 点击修改请求详情数据
    *getDetail({ payload }, { select, call, put }) {

      const orderListUrl = config.getPayDetail + payload.id;
      const { data } = yield call(httpPost, orderListUrl, {});
      if (data) {
        if (data.code == config.MSGCODE_SUCCESS) {
          // 把请求到的数据给editData

          yield put({
            type: 'updatePayload',
            payload: { editData: data.data }
          });

        } else {
          message.error(data.msg);
          console.log(data.msg);
        }
      }
    },

    //删除支付方式
    *delPayMethod({ payload }, { select, call, put }) {
      // 注意链接地址要加一个要删除的支付方式的id
      const orderListUrl = config.deletePayMethod + payload.id;
      const { data } = yield call(httpPost, orderListUrl, {});
      if (data) {
        if (data.code == config.MSGCODE_SUCCESS) {
          // 删除成功后重新请求列表数据
 
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
    //修改某条数据中的信息
    *editPayMethodDetail({ payload }, { select, call, put }) {


      // 注意链接地址要加一个要修改的支付方式的id
      const orderListUrl = config.editPayMethod + payload.id;
      
      // id拼在了请求地址中，请求body中要删除id这一项
      let newPayload = {};
      for (var key in payload) {
        if (key != "id") {
          newPayload[key] = payload[key]
        }
      }
      const { data } = yield call(httpPost, orderListUrl, newPayload);
      if (data) {
        if (data.code == config.MSGCODE_SUCCESS) {
          message.success("操作成功!");
          // yield put({
          //   type: 'query',
          //   payload: {}
          // });
          //  新增成功跳转页面
          yield put(routerRedux.push({
            pathname: "/zfgl",
            query: { type: "zfgl" }
          }));
        } else {
          message.error(data.msg);
          console.log(data.msg);
        }
      }
    },
    // 新增支付方式
    *addMethod({ payload }, { select, call, put }) {
      console.log("1新增测试调用接口方法")
      // let allowSubmit = yield select(({ zfglPageConfig }) => zfglPageConfig.allowSubmit);
      // if (allowSubmit) {
      //   return
      // }
      // 不让重复新增的开关
      // yield put({
      //   type: 'updatePayload',
      //   payload: { allowSubmit: true }
      // });

      const orderListUrl = config.addPayMethod;
      const { data } = yield call(httpPost, orderListUrl, payload);
      if (data) {
        console.log("2新增测试调用接口成功走接口")
        if (data.code == config.MSGCODE_SUCCESS) {
          message.success("新增成功!");
          yield put({
            type: 'query',
            payload: {}
          });

          //  新增成功跳转页面
          yield put(routerRedux.push({
            pathname: "/zfgl",
            query: { type: "zfgl" }
          }));
        } else {
          message.error(data.msg);
          // // 放开限制，可以执行保存按钮
          // yield put({
          //   type: 'updatePayload',
          //   payload: { allowSubmit: false }
          // });
          
        }
      } else {
        // yield put({
        //   type: 'updatePayload',
        //   payload: { allowSubmit: false }
        // });

      }
    },

    // 新增输入或者修改折扣名称时验证折扣名称是否已经存在,新增不传id，修改传id
    *checkName({ payload }, { select, call, put }) {
      let way = yield select(({ zfglPageConfig }) => zfglPageConfig.way);
      let payMethodName = yield select(({ zfglPageConfig }) => zfglPageConfig.editData.payMethodName);
      if (way == "add") {
        let orderListUrl = config.checkPayNameUrl;
        const { data } = yield call(httpPost, orderListUrl, { payMethodName: payMethodName });
        if (data) {
          if (data.code == config.MSGCODE_SUCCESS) {
            // 1存在 ，0不存在
            
            yield put({
              type: 'updatePayload',
              payload: { checkName: data.data }
            });
          } else {
            message.error(data.msg);
            console.log(data.msg);
          }
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