import {getUserStatus} from '../../../../services/CommonService';
import { httpPost } from '../../../../services/HttpService';
import { config } from '../../../../services/HttpService';
import { routerRedux } from 'dva/router';
import key from 'keymaster';

export default{
	namespace:'welcome',
	state:{
		role:[],	// 角色数组
		lasttime:'',	// 最后一次登录时间
		lasttimeIp:'',	// 登录IP
		allcount:'',	// 登录次数
		maskstatus:'',	// 遮罩层显示隐藏
		ajaxstatus:'',	// 接口返回错误信息显示状态
		msg:'',	// 接口返回错误信息
		pwd:'',//激活账号旧密码
	},

	subscriptions: {
		setup({ dispatch, history }) {
		  history.listen(location => {
			if (location.pathname === '/welcome') {
			  // dispatch({
				// type: 'initReset',
			  // });
			}
		  });
		},
    },
  
	effects:{
		// 重置密码
		*resetPwd({ payload },{select,call,put}){

			payload.oldpwd=yield select(({ welcome }) => welcome.pwd);
			const url = config.updatePwdUrl;
			const { data } = yield call(httpPost,url,payload);

			if(data){
			
				if((data.code) && (data.code == 200)){
					yield put({
						type:'successHide'
					});

					yield put(routerRedux.push({
                        pathname: '/login',
                    }));
				}else{
					yield put({
						type:'ajaxFailshow',
						payload: {
							msg: data.msg,
						  },
					});
				}
			}
		}
	},
	reducers:{
		initReset(state, action){
			const userStatus = getUserStatus();
			var maskstatus='';
			//1首次登录还是未激活，需要修改密码
			if(userStatus==1)
			{
				maskstatus = 'block';
			}else {
				maskstatus = 'none';
			}
			return { ...state, ...action.payload,maskstatus:maskstatus};
		},
		
		loginInfo(state, action){
			return { ...state, ...action.payload};
		},
		
		successHide(state, action){
			var maskstatus='none';
			return { ...state, ...action.payload,maskstatus:maskstatus,pwd:''};
		},
		
		ajaxFailshow(state, action){

			var ajaxstatus='block';
			
			return { ...state, ...action.payload,ajaxstatus:ajaxstatus};
		},
		
		onblurSuccess(state,action){
			var ajaxstatus = 'none';
			return  { ...state, ...action.payload,ajaxstatus:ajaxstatus};
		},
	}
}