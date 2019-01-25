import { httpPost } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';
import moment from 'moment';


export default {
    namespace: 'zjzd',
    state: {
        start:0,
        total:0,
        size:10,
        current:1,
        loading:false,

        activeKey:1,
        endOpen: false,
        list:[],
        storeList:[],
        restaurantId:0,
        name:'',

        startTime: moment().subtract(1, "days").format("YYYY-MM-DD 00:00:00"),
        endTime: moment().subtract(1, "days").format("YYYY-MM-DD 23:59:59"),
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/zjzd') {
                    dispatch({
                        type:'updatePayload',
                        payload:{
                            //修改
							options:[],//联动数据
							choosedArr:[],//联动框选中的数据
                        }
                    })
                    dispatch({
						type:'choseRestaurantListUrl',
						payload:{}
					})
                }
            })  
        },
    },

    effects: {
        *choseRestaurantListUrl({ payload }, { select, call, put }) {
			yield put({type: 'showLoading'});
			
			const zjzd=yield select(({zjzd}) => zjzd);
			  
            const {data} = yield call(httpPost, config.choseRestaurantListUrl, payload);
            if (data && data.code == config.MSGCODE_SUCCESS) {
				
                var options=[],arr=[],restaurantId=0,name=''
                var res_yzy=sessionStorage.getItem('res_yzy')?JSON.parse(sessionStorage.getItem('res_yzy')):0,
					resName_yzy=sessionStorage.getItem('resName_yzy')?JSON.parse(sessionStorage.getItem('resName_yzy')):''
				var isExist=false
				if(data.data&&data.data.brandList&&data.data.brandList.length>0){
					arr.push(data.data.brandList[0].brandId)
					if(data.data.brandList[0].restaurantList&&data.data.brandList[0].restaurantList.length>0){
						restaurantId=data.data.brandList[0].restaurantList[0].restaurantId
                        arr.push(restaurantId)
                        name=data.data.brandList[0].restaurantList[0].restaurantName
						if(res_yzy!=0){
							data.data.brandList.map(v=>{
								v.restaurantList.map(vv=>{
									if(vv.restaurantId==res_yzy[1]){
										isExist=true
										resName_yzy=vv.restaurantName
										sessionStorage.setItem('resName_yzy',JSON.stringify(vv.restaurantName))
									}
								})
							})
						}
                    }
                    if(!isExist){
						resName_yzy=false,res_yzy=false
						sessionStorage.removeItem('resName_yzy')
						sessionStorage.removeItem('res_yzy')
					}
					data.data.brandList.map(v=>{
						options.push({
							label:v.brandName,
							value:v.brandId,
						})
						if(v.restaurantList&&v.restaurantList.length>0){
							var arr=[]
							v.restaurantList.map(vv=>{
								arr.push({
									label:vv.restaurantName,
									value:vv.restaurantId
								})
								options[options.length-1].children=arr
							})
						}
					})
				}
				yield put({
					type:'updatePayload',
					payload:{
						options,
						choosedArr:res_yzy&&res_yzy.length>0?res_yzy:arr,
                        restaurantId:res_yzy&&res_yzy.length>0?res_yzy[1]:restaurantId,
                        name:resName_yzy&&resName_yzy.length>0?resName_yzy:name
					}
				})
				yield put({
                    type:'fundBillStore',
                    payload:{}
                })
				
				yield put({type: 'hideLoading'});
            }else{
                yield put({type: 'hideLoading'});
                message.error(data?data.msg:'接口报错')
            }
  		},
        * fundBillStore({ payload }, { select, call, put }) {
            yield put({ type: 'showLoading' });

            const zjzd = yield select(({ zjzd }) => zjzd)
            payload.startTime = new Date(zjzd.startTime).getTime()
            payload.endTime = new Date(zjzd.endTime).getTime()
            payload.restaurantId=+zjzd.restaurantId

            const { data } = yield call(httpPost, config.fundBillStore, payload);
            if (data) {
                yield put({ type: 'hideLoading' });
                if (data.code == config.MSGCODE_SUCCESS) {

                    if (data.data && data.data.length > 0) {
                        data.data.map((v, i) => {
                            v.key = +i + 1
                        })
                    }
                    yield put({
                        type: 'updatePayload',
                        payload: {list: data.data}
                    })

                } else {
                    message.error(data ? data.msg : '接口报错');
                }
            } else {
                yield put({ type: 'hideLoading' });
            }
        }
    },

    reducers: {
        updatePayload(state, action) {
            return { ...state, ...action.payload, };
        },
        /*显示加载提示*/
        showLoading(state) {
            return { ...state, loading: true };
        },

        /*隐藏加载提示*/
        hideLoading(state) {
            return { ...state, loading: false };
        },
    }
}