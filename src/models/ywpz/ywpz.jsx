import { httpPost,httpPostWithId } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import Message from 'antd/lib/message';

function sortarr(arr){
    for(var i=0;i<arr.length-1;i++){
        for(var j=0;j<arr.length-1-i;j++){
            if(arr[j].startTime>arr[j+1].startTime){
                var temp=arr[j];
                arr[j]=arr[j+1];
                arr[j+1]=temp;
            }
        }
    }
    return arr;
}

export default{
	namespace:'ywpz',
	state:{
		offset:0,
		size:10,
		modalVisible:false,
        tabkey:'1',
        timePeiods:[
            {
                "endTime": "00:00",
                "startTime": "00:00"
            }
		],
        distributionAreas:[
            {
                "areaName": "",
                "takeMoney": 0,
                "targetMoney": 0
            }
		],
        newDistributionAreas:[
            {
                "areaName": "",
                "takeMoney": 0,
                "targetMoney": 0
            }
        ],
        startMoney:0,
        time:0,
		id:0,

    },

	 subscriptions: {
		setup({ dispatch, history }) {
		  history.listen(location => {
			if (location.pathname === '/ywpz') {
			  dispatch({
				type: 'xtszPageConfig/getBase',
				payload: {},
			  });

				dispatch({
					type: 'queryTakeoutSate',
					payload: {},
				});

                dispatch({
                    type: 'updatePayload',
                    payload: {tabkey:'1'},
                });

                dispatch({
                    type: 'deskQrCode/getWXState',
                    payload: {},
                });
			}
		  });
		},
    }, 
  
	effects:{		
		*query({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.commentget;
		      payload.offset = yield select(({ ywpz }) => ywpz.offset);
		      payload.size = yield select(({ ywpz }) => ywpz.size);
		      			 
		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		var total= data.data.length;
					data.data.map((value,index)=>{
						value.key=+index+1
					})
			      		yield put({
			          type: 'updatePayload',
			          payload: {
			            list: data.data,
			            total: data.totalCount,
			          },
			        });
		      	}else{
						console.log(data.msg);
				} 
		  }  
  		},
  		*queryTakeoutSate({ payload }, { select, call, put }) {

		      const { data } = yield call(httpPost,config.queryTakeoutSate, payload);
		      if (data) {
		      	
		      	if(data.code == config.MSGCODE_SUCCESS){
			      		yield put({
				          type: 'updatePayload',
				          payload: {
						    homeTakeoutState: data.data.homeTakeoutState,
						    packageTakeoutState:data.data.packageTakeoutState,
				          },
			      	  });
		      	}else{
						console.log(data.msg);
				} 
		  }  
  		},
  		*setHomeTakeoutState({ payload }, { select, call, put }) {

		      payload.state = yield select(({ ywpz }) => ywpz.homeTakeoutState);

		      const { data } = yield call(httpPost,config.setHomeTakeoutState,payload);
		      if (data) {
		      	
		      	if(data.code == config.MSGCODE_SUCCESS){
		      	
			      	  yield put({
				          type: 'queryTakeoutSate',
				          payload:{},
				        });
		      	}else{
						console.log(data.msg);
				} 
		  }  
  		},
        *setPackageTakeoutState({ payload }, { select, call, put }) {

            payload.state = yield select(({ ywpz }) => ywpz.packageTakeoutState);

            const { data } = yield call(httpPost,config.setPackageTakeoutState,payload);
            if (data) {

                if(data.code == config.MSGCODE_SUCCESS){

                    yield put({
                        type: 'queryTakeoutSate',
                        payload:{},
                    });
                }else{
                    console.log(data.msg);
                }
            }
        },
        *zyTakeoutAddConfig({ payload }, { select, call, put }) {

            let timePeiods = yield select(({ ywpz }) => ywpz.timePeiods);

            let newTimePeiods = sortarr(timePeiods)

            for(var i=0;i<newTimePeiods.length-1;i++){

                if (newTimePeiods[i].endTime > newTimePeiods[i+1].startTime ){

                    Message.warning('时间段冲突');
                    return;
                }

            }

            for(var i=0;i<newTimePeiods.length;i++){

                if (newTimePeiods[i].startTime > newTimePeiods[i].endTime ) {

                    Message.warning('开始时间不能大于结束时间');
                    return;
                }
            }

            payload.distributionAreas = yield select(({ ywpz }) => ywpz.distributionAreas);
            payload.timePeiods = yield select(({ ywpz }) => ywpz.timePeiods);;
            payload.startMoney = yield select(({ ywpz }) => ywpz.startMoney);
            payload.time = yield select(({ ywpz }) => ywpz.time);

            const { data } = yield call(httpPost,config.zyTakeoutAddConfig,payload);
            if (data) {

                if(data.code == config.MSGCODE_SUCCESS){
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            modalVisible:false,
                        },
                    });

                }else{
                    console.log(data.msg);
                }
            }
        },

        *zyTakeoutUpdateConfig({ payload }, { select, call, put }) {

            let timePeiods = yield select(({ ywpz }) => ywpz.timePeiods);

            let newTimePeiods = sortarr(timePeiods)

            for(var i=0;i<newTimePeiods.length-1;i++){

                if (newTimePeiods[i].endTime > newTimePeiods[i+1].startTime ){

                    Message.warning('时间段冲突');
                    return;
                }

            }

            for(var i=0;i<newTimePeiods.length;i++){

                if (newTimePeiods[i].startTime > newTimePeiods[i].endTime ) {

                    Message.warning('开始时间不能大于结束时间');
                    return;
                }
            }



            let distributionAreas = yield select(({ ywpz }) => ywpz.distributionAreas);

            let newDistributionAreas = yield select(({ ywpz }) => ywpz.newDistributionAreas);

            distributionAreas.map((i)=>{

                var isDelete = true;
                newDistributionAreas.map((j)=>{

                    if (j.id == i.id){

                        i.areaName = j.areaName;
                        i.takeMoney = j.takeMoney;
                        i.targetMoney = j.targetMoney;
                        isDelete = false;

                    }
                })

                if (isDelete){

                    i.type = 0;

                }

            })

            newDistributionAreas.map((j)=>{

                if (j.type == 1){

                    distributionAreas.push(j);

                }
            })

            payload.distributionAreas = distributionAreas;
            payload.timePeiods = yield select(({ ywpz }) => ywpz.timePeiods);
            payload.startMoney = yield select(({ ywpz }) => ywpz.startMoney);
            payload.time = yield select(({ ywpz }) => ywpz.time);

            let id = yield select(({ ywpz }) => ywpz.id);

            const { data } = yield call(httpPost,config.zyTakeoutUpdateConfig + id ,payload);
            if (data) {

                if(data.code == config.MSGCODE_SUCCESS){

                    yield put({
                        type: 'updatePayload',
                        payload: {
                            modalVisible:false,
                        },
                    });
                }else{
                    console.log(data.msg);
                }
            }
        },
        *zyTakeoutQueryConfig({ payload }, { select, call, put }) {

            const { data } = yield call(httpPost,config.zyTakeoutQueryConfig, payload);
            if (data) {

                if(data.code == config.MSGCODE_SUCCESS){

                	if (!data.data.distributionAreas) {
                        data.data.distributionAreas = [
                            {
                                "areaName": "",
                                "takeMoney": 0,
                                "targetMoney": 0
                            }
                        ]
                    }

                    if (!data.data.timePeiods){
                        data.data.timePeiods = [
                            {
                                "endTime": "00:00",
                                "startTime": "00:00"
                            }
                        ]
                    }

                    if (!data.data.id) {
                	    data.data.id = 0
                    }

                    if (!data.data.startMoney) {
                        data.data.startMoney = 0
                    }

                    if (!data.data.time) {
                        data.data.time = 0
                    }

                    yield put({
                        type: 'updatePayload',
                        payload: {
                            distributionAreas: data.data.distributionAreas,
                            newDistributionAreas:JSON.parse(JSON.stringify(data.data.distributionAreas)),
                            startMoney: data.data.startMoney,
                            time: data.data.time,
                            timePeiods: data.data.timePeiods,
                            id: data.data.id,
                        },
                    });
                }else{
                    console.log(data.msg);
                }
            }
        },


		*deleteAction({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			// 注意链接地址要加一个要删除的原因备注的id
			const orderListUrl = config.deleteCommentUrl + payload.id;
			const { data } = yield call(httpPost,orderListUrl, payload);
			if (data) {
				if(data.code == config.MSGCODE_SUCCESS){
					yield put({
						type: 'query',
						payload: {},
					});
				}else{
					console.log(data.msg);
				}
			}
		},


	},
	reducers:{
	
	    updatePayload(state,action){
			return { ...state, ...action.payload,};
	 	},
		
	}
}