import { httpPost,httpPostWithId } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';



export default{
	namespace:'cppx',
	state:{
        radioValue:'1',
	},

	 subscriptions: {
		setup({ dispatch, history }) {
		  history.listen(location => {
			if (location.pathname === '/cppx') {

                dispatch({
                    type:'updatePayload',
                    payload:{
                        radioValue:'1',

                    }
                })

                dispatch({
                    type: 'deskQrCode/updatePayload',
                    payload: {
                        typeOrigin:2,
                        tabkey:'1'
                    },
                });

                dispatch({
                    type:'sydcppxPageConfig/updatePayload',
                    payload:{
                        typeOrigin:2
                    }
                })
                dispatch({
                    type:'sydcppxPageConfig/getList',
                    payload:{}
                })

                dispatch({
                    type:'deskQrCode/querySelectBusinessHours',
                    payload:{}
                })


			}
		  });
		},
    }, 
  
	effects:{


	},
	reducers:{
	
	    updatePayload(state,action){
			return { ...state, ...action.payload,};
	 	},
		
	}
}