import { httpPost } from '../../../services/HttpService';
import { config } from '../../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';




export default {
  namespace: 'lszfglConfig',
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

    brandId: 0,
    brandList: [],
    payload_yzy:{},

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
        if (location.pathname === '/lszfgl') {
          dispatch({
						type:'updatePayload',
						payload:{

							allotModalVisible:false,
							allotModal_key1:'',
							allotModal_key2:'',
							allotModal_key3:'1',

							selectedRowKeys:[],
							selectedRows:[],

							resModalVisible:false,

							checkAll:false,
							indeterminate: true,
							checkedList:[],

							plainOptions:[],
						}
					})
          // console.log(location.query)
          // 页面加载调用列表数据
          dispatch({
            type: 'brandListUrl',
            payload: {},
          });
        }
      });
    },

  },

  effects: {
    * brandListUrl({ payload }, { select, call, put }) {
			const { data } = yield call(httpPost, config.brandListUrl, payload);
			if (data&&data.code == config.MSGCODE_SUCCESS) {
				yield put({
					type: 'updatePayload',
					payload: {
						brandList: data.data,
						brandId: !sessionStorage.getItem('brandId_lszfglConfig') ? (data.data.length > 0 ? data.data[0].key : 0) : +sessionStorage.getItem('brandId_lszfglConfig'),
					}
				});
				yield put({
					type: 'chooseBrandUrl',
					payload: {}
				});
			} else {
				message.error(data ? data.msg : '接口报错')
			}
		},
		*chooseBrandUrl({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			const lszfglConfig = yield select(({ lszfglConfig }) => lszfglConfig)

			const { data } = yield call(httpPost, config.chooseBrandUrl + lszfglConfig.brandId, payload);
			if (data) {
				if (data.code == config.MSGCODE_SUCCESS) {

					yield put({
						type: 'query',
						payload: {}
          })
          yield put({
						type: 'storeByBrandId',
						payload: {}
					})
					yield put({ type: 'hideLoading' });
				} else {
					yield put({ type: 'hideLoading' });
					message.error(data ? data.msg : '接口报错')
				}
			}
		},
    //请求列表数据
    *query({ payload }, { select, call, put }) {
      const orderListUrl = config.payTypeQuery;
      payload.offset = yield select(({ lszfglConfig }) => lszfglConfig.offset);
      payload.size = yield select(({ lszfglConfig }) => lszfglConfig.size);
      const { data } = yield call(httpPost, orderListUrl, payload);
      
      if (data) {
        if (data.code == config.MSGCODE_SUCCESS) {
          // 更新页面中的数据

          if(data.data&&data.data.length>0){
            data.data.map((v,i)=>{
              v.key=i+1
            })
          }

          yield put({
            type: 'updatePayload',
            payload: {
              dataSource: data.data,
              total: data.totalCount,
              selectedRowKeys:[],
						  selectedRows:[],
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

      const orderListUrl = config.payTypeSelectById+'?id='+ payload.id;
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
      const orderListUrl = config.payTypeDeleteById +'?id='+ payload.id;
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
      const orderListUrl = config.payTypePost;
      
      // id拼在了请求地址中，请求body中要删除id这一项
      // let newPayload = {};
      // for (var key in payload) {
      //   if (key != "id") {
      //     newPayload[key] = payload[key]
      //   }
      // }
      const { data } = yield call(httpPost, orderListUrl, payload);
      if (data) {
        if (data.code == config.MSGCODE_SUCCESS) {
          message.success("修改成功!");
          // yield put({
          //   type: 'query',
          //   payload: {}
          // });
          //  新增成功跳转页面
          yield put(routerRedux.push({
            pathname: "/lszfgl",
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
      // let allowSubmit = yield select(({ lszfglConfig }) => lszfglConfig.allowSubmit);
      // if (allowSubmit) {
      //   return
      // }
      // 不让重复新增的开关
      // yield put({
      //   type: 'updatePayload',
      //   payload: { allowSubmit: true }
      // });

      const orderListUrl = config.payTypePost;
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
            pathname: "/lszfgl",
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
      const lszfglConfig=yield select(({lszfglConfig})=>lszfglConfig)
      let way = yield select(({ lszfglConfig }) => lszfglConfig.way);
      let payMethodName = yield select(({ lszfglConfig }) => lszfglConfig.editData.payMethodName);
      let id = yield select(({ lszfglConfig }) => lszfglConfig.editData.id);
      let type= yield select(({ lszfglConfig })=> lszfglConfig.editData.payMethodType);
      if (way == "add") {
        let orderListUrl = config.payTypeCheckName+'?id='+id+'&name='+payMethodName+'&type='+type;
        const { data } = yield call(httpPost, orderListUrl, payload);
        if (data) {
          if (data.code == config.MSGCODE_SUCCESS) {
            // 1存在 ，0不存在
            
            // yield put({
            //   type: 'updatePayload',
            //   payload: { checkName: data.data }
            // });
            // 检测支付名称是否出现过
            if (data.data == 1) {
              message.error('同一支付类型下面不能有重复的支付名称')
              return
            }

            yield put({
              type: 'addMethod',
              payload: lszfglConfig.payload_yzy
            });
          } else {
            message.error(data.msg);
          }
        }
      }
    },
    *storeByBrandId({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			const lszfglConfig=yield select(({ lszfglConfig }) => lszfglConfig);
			const { data } = yield call(httpPost, config.storeByBrandId+lszfglConfig.brandId, payload);
			if (data&&data.code == config.MSGCODE_SUCCESS) {

				var arr=[]
				if(data.data&&data.data.length>0){
					data.data.map(v=>{
						arr.push({
							label:v.value,
							value:v.key
						})
					})
				}

				yield put({
					type: 'updatePayload',
					payload: {
						plainOptions:arr
					},
				});
			} else {
				message.error(data ? data.msg : '接口报错')
			}
    },
    *payTypeAllotPayMethod({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			const lszfglConfig=yield select(({ lszfglConfig }) => lszfglConfig);
			payload.payMethodIds=lszfglConfig.selectedRowKeys
			payload.restaurantIds=lszfglConfig.checkedList
			payload.type=+lszfglConfig.allotModal_key3
			const { data } = yield call(httpPost, config.payTypeAllotPayMethod, payload);
			if (data&&data.code == config.MSGCODE_SUCCESS) {
				message.success('分配成功')
				yield put({
					type:'updatePayload',
					payload:{
						selectedRowKeys:[],
					}
				})
			} else {
				message.error(data ? data.msg : '接口报错')
			}
		},
  },
  reducers: {
    updatePayload(state, action) {
      return { ...state, ...action.payload, };
    },
  }
}