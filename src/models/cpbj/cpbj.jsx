import { httpPost } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';



export default{
	namespace:'cpbjPageConfig',
	state:{
		loading: false,
		visible: false,
		queryIndex:null,
		activityName:'',
		isChecked:false,
		dataSource :[
		    {
		      key: '1',
		      name: '午餐烧烤优惠1',
		      start_time: '2017-08-21',
		      end_time:'2017-08-31',
		      decription:'11111111',
		      status: '启用',
		      edit:'编辑',
		      sub:[
		      	{
		      		key: '11',
			  		duration:'周一',
			        start_tm: '00:00',
			        end_tm:'24:00',
			        name: '午餐烧烤优惠1',
			        price:0.00,
			        activity_price:0.00,
			        member_price:0.00
		      	},
		      	{
		      		key: '12',
			  		duration:'全周',
			        start_tm: '00:00',
			        end_tm:'24:00',
			        name: '午餐烧烤优惠1',
			        price:0.00,
			        activity_price:0.00,
			        member_price:0.00
		      	}
		      ]
		    },
		    {
		      key: '2',
		      name: '午餐烧烤优惠2',
		      start_time: '2017-08-21',
		      end_time:'2017-08-31',
		      decription:'2222222',
		      status: '启用',
		      edit:'编辑',
		      sub:[
		      	{
		      		key: '21',
			  		duration:'全周',
			        start_tm: '00:00',
			        end_tm:'24:00',
			        name: '午餐烧烤优惠2',
			        price:0.00,
			        activity_price:0.00,
			        member_price:0.00
		      	}
		      ]
		    }
		],
		subData:[

		]
	},

	subscriptions: {

    }, 
  
	effects:{
		
	},
	reducers:{	
	    updatePayload(state,action){
			return { ...state, ...action.payload,};
	 	},
		
	}
}