import { httpPost,httpPostWithId } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import Message from "antd/lib/message/index";


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
	namespace:'video',
	state:{

        touchScreenList:[],
        configId:0,
        isLoop:1,
        playDevice:[],
        videoUrl:'',
        playTimes:[
				{
					"endTime": "00:00",
					"startTime": "00:00"
				}
			],
		},

	 subscriptions: {
		setup({ dispatch, history }) {
		  history.listen(location => {
			if (location.pathname === '/video') {
			  dispatch({
				type: 'query',
				payload: location.query,
			  });

				dispatch({
					type: 'getTouchScreen',
					payload: {},
				});

			}
		  });
		},
    }, 
  
	effects:{		
		*query({ payload }, { select, call, put }) {

		      const { data } = yield call(httpPost,config.videoGet, payload);
		      if (data) {
		      	
		      	if(data.code == config.MSGCODE_SUCCESS){

			      		if(data.data){
                            yield put({
                                type: 'updatePayload',
                                payload: {
                                    playTimes: data.data.playTimes,
                                    playDevice: data.data.playDevice,
                                    videoUrl:data.data.videoUrl,
                                    configId:data.data.configId,
                                    isLoop:data.data.isLoop,
                                },
                            });
						}
		      	}else{
						console.log(data);
				} 
		  }  
  		},
  		*getTouchScreen({ payload }, { select, call, put }) {

		      const { data } = yield call(httpPost,config.getTouchScreen, payload);
		      if (data) {
		      	
		      	if(data.code == config.MSGCODE_SUCCESS){
			      		yield put({
				          type: 'updatePayload',
				          payload: {
				          	touchScreenList:data.data
				          },
			      	  });
		      	}else{
						console.log(data);
				} 
		  }  
  		},
  		*videoSet({ payload }, { select, call, put }) {

            let playTimes = yield select(({ video }) => video.playTimes);

            let newPlayTimes = sortarr(playTimes)

            for(var i=0;i<newPlayTimes.length-1;i++){

                if (newPlayTimes[i].endTime > newPlayTimes[i+1].startTime ){

                    Message.warning('时间段冲突');
                    return;
                }

            }

            for(var i=0;i<newPlayTimes.length;i++){

                if (newPlayTimes[i].startTime > newPlayTimes[i].endTime ) {

                    Message.warning('开始时间不能大于结束时间');
                    return;
                }
            }

		      payload.configId = yield select(({ video }) => video.configId);
		      payload.isLoop = yield select(({ video }) => video.isLoop);
			  payload.playDevice = yield select(({ video }) => video.playDevice);
			  payload.playTimes = yield select(({ video }) => video.playTimes);
		  	  payload.videoUrl = yield select(({ video }) => video.videoUrl);


		      const { data } = yield call(httpPost, config.videoSet, payload);
		      if (data) {
		      	
		      	if(data.code == config.MSGCODE_SUCCESS){

                    Message.success('保存成功');
			      	  yield put({
				          type: 'query',
				          payload:{},
				        });
		      	}else{
                    Message.warning(data.msg);
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