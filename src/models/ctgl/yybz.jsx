import { httpPost,httpPostWithId } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';



export default{
	namespace:'yybz',
	state:{
		offset:0,
		size:10,
		modalVisible:false,
		commentTypes:[],
		isAdd:true,
		id:'',
        comment:'',
        commentType:1,
        keyword:'',

	},

	 subscriptions: {
		setup({ dispatch, history }) {
		  history.listen(location => {
			if (location.pathname === '/yybz') {
			  dispatch({
				type: 'query',
				payload: location.query,
			  });

			   dispatch({
				type: 'queryCommentTypes',
				payload: location.query,
			  });

			}
		  });
		},
    }, 
  
	effects:{		
		*query({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.commentget;
		      payload.offset = yield select(({ yybz }) => yybz.offset);
		      payload.size = yield select(({ yybz }) => yybz.size);
		      			 
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
  		*queryCommentTypes({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.commentTypesUrl;
		      payload.offset = yield select(({ yybz }) => yybz.offset);
		      payload.size = yield select(({ yybz }) => yybz.size);
		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		var total= data.data.length;
			      		yield put({
				          type: 'updatePayload',
				          payload: {
				            commentTypes: data.data,
							commentType:data.data[0].value,
				          },
			      	  });
		      	}else{
						console.log(data.msg);
				} 
		  }  
  		},
  		*updateComment({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.commentUpdateUrl;
		      payload.comment = yield select(({ yybz }) => yybz.comment);
		      payload.commentType = yield select(({ yybz }) => yybz.commentType);

		      const { data } = yield call(httpPostWithId,orderListUrl, payload,yield select(({ yybz }) => yybz.id));
		      if (data) {
		      	
		      	if(data.code == config.MSGCODE_SUCCESS){
		      	
			      	  yield put({
				          type: 'query',
				          payload:{},
				        });
		      	}else{
						console.log(data.msg);
				} 
		  }  
  		},
  		*addComment({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.addCommentUrl;
		      payload.comment = yield select(({ yybz }) => yybz.comment);
		      payload.commentType = yield select(({ yybz }) => yybz.commentType);

		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	
		      	if(data.code == config.MSGCODE_SUCCESS){
		      	
			      	  yield put({
				          type: 'query',
				          payload:{},
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