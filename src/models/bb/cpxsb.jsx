import { httpPost,linkOrigin } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import moment from "moment/moment";
import message from 'antd/lib/message';
const todaystart = moment().startOf("month");
const todayend = moment().endOf('day');


export default{
	namespace:'cpxsb',
	state:{
        linkOrigin:linkOrigin,
        categoryName:'全部',
        cateList:[],
		start:0,
		size:10,
        start1:0,
        size1:10,
        current:1,
        current1:1,
        startTime: todaystart,
        endTime: todayend,
        startTime1: todaystart,
        endTime1: todayend,
        postStartTime:new Date(moment().startOf("month")).getTime(),
        postEndTime:new Date(moment().endOf('day')).getTime(),
        postStartTime1:new Date(moment().startOf("month")).getTime(),
        postEndTime1:new Date(moment().endOf('day')).getTime(),
        static_days:'0',
        static_days1:'0',
		orgName:'',
		resIdOrgNameMap:{},
		restaurantIds:null,
        restaurantList:[],
		list1:[],
		choosedIndex:null,
        choosedIndex1:null,
        postChoosedIndex:[],
        postChoosedIndex1:[],
        combosellStat:{},
        foodsellStat:{},
		foodList:[],
		combosellList:[],
        storeList:[],
        restaurantId:"",
		activeIndex:0,
        postMap:"{}",
        postMap1:"{}",
		
		obj1:[],
		value:[],
		autoExpand:false,

        queryType:'1',
        foodNames:[],
        comboNames:[],


        cateList:[],
        comboList:[],
        cpflList:[],

        cpflType:1,//1-品牌，2-门店
        foodType:1,//1-品牌，2-门店

        categoryName_val:'全部',
        foodNames_val:[],
	},

	subscriptions: {
		setup({ dispatch, history }) {
		  history.listen(location => {
			if (location.pathname === '/cpxsb') {
				dispatch({
    				type: 'updatePayload',
    				payload: {autoExpand:false,},
    			});
    			dispatch({
    				type: 'userPower',
    				payload: {},
    			});
			}
		  });
		},
    }, 
  
	effects:{
		* userPower({payload}, {select, call, put}) {
            yield put({type: 'showLoading'});
            const {data} = yield call(httpPost, config.userPower, payload);
            if (data && data.code == config.MSGCODE_SUCCESS) {
				
                if(Object.keys(data.data).length>0){
                    let parent={
                        id: '-0',
                        nodeCode: '-0',
                        nodeName: '',
                        nodeType: '-0',
                        children:[]
                    }
                    for(var i=data.data.children.length-1;i>=0;i--){
                        if(!data.data.children[i].children){
                            let obj_yzy={}
                            for(var key in data.data.children[i]){
                                obj_yzy[key]=data.data.children[i][key]
                            }
                            parent.children.push(obj_yzy)
                            data.data.children.splice(i,1)
                        }
                    }
                    data.data.children.push(parent)

                    for(var i=data.data.children.length-1;i>=0;i--){
                        if(data.data.children[i].children&&data.data.children[i].children.length==0){
                            data.data.children.splice(i,1)
                        }
                    }
                }

                let arr=[],obj2={},value=[]
                let a=1
				function extend(target, source) {
				  for (var key in source) {
					if (Object.prototype.toString.call(source[key]) === '[object Object]') {
					  target[key] = {}
					  extend(target[key], source[key])
					} else if (Object.prototype.toString.call(source[key]) === '[object Array]') {
					  target[key] = []
					  extend(target[key], source[key])
                      a++
					} else {
					  if (key == "nodeName") {
						target["title"] = source[key];
					  }else{
						target[key] = source[key]
					  }
					  target["key"] = source["id"] + "-" + source["nodeName"]
					  target["value"] = source["id"] + "-" + source["nodeName"]
					  if(Object.keys(source).indexOf('children')==-1&&arr.indexOf(source["id"])==-1&&a==1){
						  arr.push(source["id"])
						  value.push(source["id"] + "-" + source["nodeName"])
						  obj2[source["id"]]=source["nodeName"]
                          
					  }
					}
				  }
				}
				
				let obj1=[]
				if(Object.keys(data.data).length>0&&data.data.children&&data.data.children.length>0){
					extend(obj1,data.data.children)
					yield put({
						type:'updatePayload',
						payload:{
							obj1:obj1,
							resIdOrgNameMap:obj2,
							restaurantIds:arr,
							value:value
                            
						}
					})
				}
                if(obj1.length>1){
                    yield put({
                        type:'foodList',
                        payload:{
                            selectBrandId:+obj1[0].children[0].brandId
                        }
                    })
                    yield put({
                        type:'categorySelectDataByBrandId',
                        payload:{
                            brandId:+obj1[0].children[0].brandId
                        }
                    })
                    yield put({
                        type:'comboList',
                        payload:{
                            brandId:+obj1[0].children[0].brandId
                        }
                    })  
                }else if(obj1.length==1){
                    if(obj1[0].id=='-0'){
                        var arr_1=[]
                        obj1[0].children.map((v)=>{
                             arr_1.push(+v.id)
                        })
                        yield put({
                            type:'foodList1',
                            payload:{
                                restaurantIds:arr_1
                            }
                        })
                        yield put({
                            type:'categorySelectDataByRes',
                            payload:{
                                restaurantIds:arr_1
                            }
                        })
                        yield put({
                            type:'comboList1',
                            payload:{
                                restaurantIds:arr_1
                            }
                        })
                    }else{
                        yield put({
                            type:'foodList',
                            payload:{
                                selectBrandId:+obj1[0].children[0].brandId
                            }
                        })
                        yield put({
                            type:'categorySelectDataByBrandId',
                            payload:{
                                brandId:+obj1[0].children[0].brandId
                            }
                        })
                        yield put({
                            type:'comboList',
                            payload:{
                                brandId:+obj1[0].children[0].brandId
                            }
                        })
                    }
                }else{
                    yield put({
                        type:'updatePayload',
                        payload:{
                            cateList:[],
                            comboList:[],
                            cpflList:[],
                        }
                    })
                }
				
				yield put({
					type:'getData',
					payload:{}
				})
            }else{
                yield put({type: 'hideLoading'});
                message.error(data ? data.msg || data.message : '接口报错') 
            }
        },
        *foodList({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading', payload: {} })

            const { data } = yield call(httpPost, config.foodSelectDataByBrandId+'?selectBrandId='+payload.selectBrandId, payload);
            if (data&&data.code == config.MSGCODE_SUCCESS) {

                var arr=[]
                if(data.data&&data.data.length>0){
                    data.data.map((v,i)=>{
                        v.spellName=v.name+'('+(v.specName||'')+')'
                        arr.push(v)
                    })
                }
                yield put({
                    type:'updatePayload',
                    payload:{
                        cateList:arr,
                        foodType:1
                    }
                })
                yield put({ type: 'hideLoading', payload: {} })
            } else {
                message.error(data ? data.msg || data.message : '接口报错');
                yield put({ type: 'hideLoading', payload: {} })
            }
        },
        //这个接口暂时不用了，换接口
        *foodList222({ payload }, { select, call, put }) {
            const { data } = yield call(httpPost,config.specByBrandId+'?brandId='+payload.brandId, payload);
            if (data&&data.code == config.MSGCODE_SUCCESS) {
                let arr=[],str=''
                if(data.data&&data.data.length>0){
                    data.data.map((v,i)=>{
                        
                        if(v.specs.length>0){
                            v.specs.map((vv,ii)=>{
                                str=v.name
                                str=str+'('+vv.name+')'
                                arr.push(str)
                            })
                        }else{
                            str=v.name
                            str=str+'()'
                            arr.push(str)
                        }
                        
                    })
                }
                yield put({
                    type:'updatePayload',
                    payload:{
                        cateList:arr
                    }
                })
            }else{
                yield put({ type: 'hideLoading' });
                message.error(data ? data.msg || data.message : '接口报错')
            }
        },
        *foodList1({ payload }, { select, call, put }) {
            const { data } = yield call(httpPost,config.specByRestaurantIds, payload);
            if (data&&data.code == config.MSGCODE_SUCCESS) {
                let arr=[],str=''
                if(data.data&&data.data.length>0){
                    data.data.map((v,i)=>{
                        
                        if(v.specs.length>0){
                            v.specs.map((vv,ii)=>{
                                str=v.name
                                str=str+'('+vv.name+')'
                                arr.push(str)
                            })
                        }else{
                            str=v.name
                            str=str+'()'
                            arr.push(str)
                        }
                        
                    })
                }
                yield put({
                    type:'updatePayload',
                    payload:{
                        cateList:arr,
                        foodType:2
                    }
                })
            }else{
                yield put({ type: 'hideLoading' });
                message.error(data ? data.msg || data.message : '接口报错')
            }
        },
        *comboList({ payload }, { select, call, put }) {
            const { data } = yield call(httpPost,config.comboByBrandId+'?brandId='+payload.brandId, payload);
            if (data&&data.code == config.MSGCODE_SUCCESS) {
                yield put({
                    type:'updatePayload',
                    payload:{
                        comboList:data.data
                    }
                })
            }else{
                yield put({ type: 'hideLoading' });
                message.error(data ? data.msg || data.message : '接口报错')
            }
        },
        *comboList1({ payload }, { select, call, put }) {
            const { data } = yield call(httpPost,config.comboByRestaurantIds, payload);
            if (data&&data.code == config.MSGCODE_SUCCESS) {
                yield put({
                    type:'updatePayload',
                    payload:{
                        comboList:data.data
                    }
                })
            }else{
                yield put({ type: 'hideLoading' });
                message.error(data ? data.msg || data.message : '接口报错')
            }
        },
        //根据品牌id查询菜品分类
        *categorySelectDataByBrandId({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading', payload: {} })

            const { data } = yield call(httpPost, config.categorySelectDataByBrandId+'?brandId='+payload.brandId, payload);
            if (data && data.code == config.MSGCODE_SUCCESS) {

                yield put({
                    type:'updatePayload',
                    payload:{
                        cpflList:data.data||[],
                        cpflType:1
                    }
                })
                yield put({ type: 'hideLoading', payload: {} })
            } else {
                message.error(data ? data.msg || data.message : '接口报错');
                yield put({ type: 'hideLoading', payload: {} })
            }
        },
        //根据门店ids查询菜品分类
        *categorySelectDataByRes({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading', payload: {} })

            const { data } = yield call(httpPost, config.categorySelectDataByRes, payload);
            if (data && data.code == config.MSGCODE_SUCCESS) {

                yield put({
                    type:'updatePayload',
                    payload:{
                        cpflList:data.data||[],
                        cpflType:2
                    }
                })
                yield put({ type: 'hideLoading', payload: {} })
            } else {
                message.error(data ? data.msg || data.message : '接口报错');
                yield put({ type: 'hideLoading', payload: {} })
            }
        },
		*getData({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
		    const foodSellUrl = config.foodSellUrl;
            const cpxsb=yield select(({cpxsb}) => cpxsb);
            payload.startTime=new Date(cpxsb.postStartTime).getTime();
            payload.endTime=new Date(cpxsb.postEndTime).getTime(); 
            payload.restaurantIds  = cpxsb.restaurantIds;
            payload.resIdOrgNameMap  = cpxsb.resIdOrgNameMap;
            const queryType=cpxsb.queryType;
            payload.queryType=+queryType
            const categoryName=cpxsb.categoryName;
            if(categoryName!='全部'){
               payload.categoryName=categoryName
            }
            payload.foodNames=cpxsb.foodNames
		    const { data } = yield call(httpPost,foodSellUrl, payload);
		    if (data&&data.code == config.MSGCODE_SUCCESS) {
                if(data.data&&data.data.length>0){
                    data.data.map((v,i)=>{
                        v.key=+i+1
                    })
                }
                yield put({
                    type:'updatePayload',
                    payload:{foodList:data.data,value1:[]}
                })
                yield put({ type: 'hideLoading' });
            }else{
                yield put({ type: 'hideLoading' });
                message.error(data ? data.msg || data.message : '接口报错')
            }
  		},
        *getCData({ payload }, { select, call, put }) {
            yield put({ type: 'showLoading' });
            const combosellList = config.combosellList;
            const cpxsb=yield select(({cpxsb}) => cpxsb);
            payload.startTime=new Date(cpxsb.postStartTime1).getTime();
            payload.endTime=new Date(cpxsb.postEndTime1).getTime();
            payload.restaurantIds  = cpxsb.restaurantIds
            payload.resIdOrgNameMap  = cpxsb.resIdOrgNameMap
            payload.foodNames=cpxsb.comboNames
            const { data } = yield call(httpPost,combosellList, payload);
            if (data&&data.code == config.MSGCODE_SUCCESS) {
                if(data.data&&data.data.length>0){
                    data.data.map((v,i)=>{
                        v.key=+i+1
                    })
                }
                yield put({
                    type:'updatePayload',
                    payload:{combosellList:data.data,value1:[]}
                })
                yield put({ type: 'hideLoading' });
            }else{
                yield put({ type: 'hideLoading' });
                message.error(data ? data.msg || data.message : '接口报错')
            }
        },


		*getCombosellStat({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
		    const combosellStat = config.combosellStat;
            payload.startTime=new Date(cpxsb.postStartTime1).getTime();
            payload.endTime=new Date(cpxsb.postEndTime1).getTime();
            payload.restaurantIds  = cpxsb.restaurantIds
            payload.resIdOrgNameMap=cpxsb.resIdOrgNameMap
            const { data } = yield call(httpPost,combosellStat, payload);
		    if (data&&data.code == config.MSGCODE_SUCCESS) {
                yield put({
                    type:'updatePayload',
                    payload:{combosellStat:data.data,value1:[]}
                })
                yield put({ type: 'hideLoading' });
            }else{
                yield put({ type: 'hideLoading' });
                message.error(data ? data.msg || data.message : '接口报错')
            } 
  		},
        *getFoodStat({ payload }, { select, call, put }) {
            yield put({ type: 'showLoading' });
            const foodsellStat = config.foodsellStat;

            payload.startTime=new Date(cpxsb.postStartTime).getTime()
            payload.endTime=new Date(cpxsb.postEndTime).getTime();
            payload.resIdOrgNameMap=cpxsb.resIdOrgNameMap
            payload.restaurantIds=cpxsb.restaurantIds
            const { data } = yield call(httpPost,foodsellStat, payload);
            if (data&&data.code == config.MSGCODE_SUCCESS) {
                yield put({
                    type:'updatePayload',
                    payload:{foodsellStat:data.data,value1:[]}
                })
                yield put({ type: 'hideLoading' });
            }else{
                yield put({ type: 'hideLoading' });
                message.error(data ? data.msg || data.message : '接口报错')
            }
        },

	},
	reducers:{	
	    updatePayload(state,action){
			return { ...state, ...action.payload,};
	 	},
        /*显示加载提示*/
        showLoading(state) {
            return {...state, loading: true};
        },

        /*隐藏加载提示*/
        hideLoading(state) {
            return {...state, loading: false};
        },
	}
}