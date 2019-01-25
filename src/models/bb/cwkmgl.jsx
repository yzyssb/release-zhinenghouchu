import { httpPost,linkOrigin } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';
import moment from 'moment';
import common from './common.less';


export default{
	namespace:'cwkmgl',
	state:{
		linkOrigin:linkOrigin,
		loading:false,
		

		kw:'',
		columns:[
	        {title:'序号',dataIndex:'key',key:'key',className:common.right},
	        {title:'显示编号',dataIndex:'key1',key:'key1',className:common.right},
	        {title:'科目名称',dataIndex:'key2',key:'key2',className:common.left},
	        {title:'上级',dataIndex:'key3',key:'key3',className:common.left},
	        {title:'等级',dataIndex:'key4',key:'key4',className:common.right},
	        {title:'备注',dataIndex:'key5',key:'key5'},
	    ],
	    list:[
	        {key:'1',key1:'一',key2:'营业收入',key3:'',key4:'1',key5:''},
	        {key:'2',key1:'二',key2:'成本支出',key3:'',key4:'1',key5:''},
	        {key:'3',key1:'三',key2:'费用支出',key3:'',key4:'1',key5:''},
	        {key:'4',key1:'1',key2:'工资薪酬',key3:'费用支出',key4:'2',key5:''},
	        {key:'5',key1:'2',key2:'经营房租',key3:'费用支出',key4:'2',key5:''},
	        {key:'6',key1:'2',key2:'能源费',key3:'费用支出',key4:'2',key5:''},
	        {key:'7',key1:'2',key2:'招聘猎头费',key3:'费用支出',key4:'2',key5:''},
	        {key:'8',key1:'2',key2:'差旅费',key3:'费用支出',key4:'2',key5:''},
	        {key:'9',key1:'2',key2:'招待费',key3:'费用支出',key4:'2',key5:''},
	        {key:'10',key1:'2',key2:'咨询培训顾问',key3:'费用支出',key4:'2',key5:''},
	        {key:'11',key1:'2',key2:'市场营销费',key3:'费用支出',key4:'2',key5:''},
	        {key:'12',key1:'2',key2:'IT服务费',key3:'费用支出',key4:'2',key5:''},
	        {key:'13',key1:'2',key2:'其他费用',key3:'费用支出',key4:'2',key5:''},
	        {key:'14',key1:'四',key2:'财务费用',key3:'',key4:'1',key5:''},
	        {key:'15',key1:'五',key2:'考核利润',key3:'',key4:'1',key5:''},
	        {key:'16',key1:'六',key2:'折旧摊销',key3:'',key4:'1',key5:''},
	        {key:'17',key1:'七',key2:'分红',key3:'',key4:'1',key5:''},
	        {key:'18',key1:'八',key2:'净利润',key3:'',key4:'1',key5:''},
	        {key:'19',key1:'九',key2:'账户资金',key3:'',key4:'1',key5:''},
	        {key:'20',key1:'1',key2:'总应收款',key3:'',key4:'2',key5:''},
	        {key:'21',key1:'2',key2:'总应付款',key3:'',key4:'2',key5:''},
	        {key:'22',key1:'3',key2:'资金余额',key3:'',key4:'2',key5:''},
	    ],
	    show_list:[
	        {key:'1',key1:'一',key2:'营业收入',key3:'',key4:'1',key5:''},
	        {key:'2',key1:'二',key2:'成本支出',key3:'',key4:'1',key5:''},
	        {key:'3',key1:'三',key2:'费用支出',key3:'',key4:'1',key5:''},
	        {key:'4',key1:'1',key2:'工资薪酬',key3:'费用支出',key4:'2',key5:''},
	        {key:'5',key1:'2',key2:'经营房租',key3:'费用支出',key4:'2',key5:''},
	        {key:'6',key1:'2',key2:'能源费',key3:'费用支出',key4:'2',key5:''},
	        {key:'7',key1:'2',key2:'招聘猎头费',key3:'费用支出',key4:'2',key5:''},
	        {key:'8',key1:'2',key2:'差旅费',key3:'费用支出',key4:'2',key5:''},
	        {key:'9',key1:'2',key2:'招待费',key3:'费用支出',key4:'2',key5:''},
	        {key:'10',key1:'2',key2:'咨询培训顾问',key3:'费用支出',key4:'2',key5:''},
	        {key:'11',key1:'2',key2:'市场营销费',key3:'费用支出',key4:'2',key5:''},
	        {key:'12',key1:'2',key2:'IT服务费',key3:'费用支出',key4:'2',key5:''},
	        {key:'13',key1:'2',key2:'其他费用',key3:'费用支出',key4:'2',key5:''},
	        {key:'14',key1:'四',key2:'财务费用',key3:'',key4:'1',key5:''},
	        {key:'15',key1:'五',key2:'考核利润',key3:'',key4:'1',key5:''},
	        {key:'16',key1:'六',key2:'折旧摊销',key3:'',key4:'1',key5:''},
	        {key:'17',key1:'七',key2:'分红',key3:'',key4:'1',key5:''},
	        {key:'18',key1:'八',key2:'净利润',key3:'',key4:'1',key5:''},
	        {key:'19',key1:'九',key2:'账户资金',key3:'',key4:'1',key5:''},
	        {key:'20',key1:'1',key2:'总应收款',key3:'',key4:'2',key5:''},
	        {key:'21',key1:'2',key2:'总应付款',key3:'',key4:'2',key5:''},
	        {key:'22',key1:'3',key2:'资金余额',key3:'',key4:'2',key5:''},
	    ],
	},

	subscriptions: {
		setup({ dispatch, history }) {
		  history.listen(location => {
			if (location.pathname === '/cwkmgl') {
				
			}
		  });
		},
    },
  
	effects:{
		*search({ payload }, { select, call, put }) {
		    const list=yield select(({cwkmgl})=>cwkmgl.list)
		    let list1=[
		        {key:'1',key1:'一',key2:'营业收入',key3:'',key4:'1',key5:''},
		        {key:'2',key1:'二',key2:'成本支出',key3:'',key4:'1',key5:''},
		        {key:'3',key1:'三',key2:'费用支出',key3:'',key4:'1',key5:''},
		        {key:'4',key1:'1',key2:'工资薪酬',key3:'费用支出',key4:'2',key5:''},
		        {key:'5',key1:'2',key2:'经营房租',key3:'费用支出',key4:'2',key5:''},
		        {key:'6',key1:'2',key2:'能源费',key3:'费用支出',key4:'2',key5:''},
		        {key:'7',key1:'2',key2:'招聘猎头费',key3:'费用支出',key4:'2',key5:''},
		        {key:'8',key1:'2',key2:'差旅费',key3:'费用支出',key4:'2',key5:''},
		        {key:'9',key1:'2',key2:'招待费',key3:'费用支出',key4:'2',key5:''},
		        {key:'10',key1:'2',key2:'咨询培训顾问',key3:'费用支出',key4:'2',key5:''},
		        {key:'11',key1:'2',key2:'市场营销费',key3:'费用支出',key4:'2',key5:''},
		        {key:'12',key1:'2',key2:'IT服务费',key3:'费用支出',key4:'2',key5:''},
		        {key:'13',key1:'2',key2:'其他费用',key3:'费用支出',key4:'2',key5:''},
		        {key:'14',key1:'四',key2:'财务费用',key3:'',key4:'1',key5:''},
		        {key:'15',key1:'五',key2:'考核利润',key3:'',key4:'1',key5:''},
		        {key:'16',key1:'六',key2:'折旧摊销',key3:'',key4:'1',key5:''},
		        {key:'17',key1:'七',key2:'分红',key3:'',key4:'1',key5:''},
		        {key:'18',key1:'八',key2:'净利润',key3:'',key4:'1',key5:''},
		        {key:'19',key1:'九',key2:'账户资金',key3:'',key4:'1',key5:''},
		        {key:'20',key1:'1',key2:'总应收款',key3:'',key4:'2',key5:''},
		        {key:'21',key1:'2',key2:'总应付款',key3:'',key4:'2',key5:''},
		        {key:'22',key1:'3',key2:'资金余额',key3:'',key4:'2',key5:''},
		    ]
		    console.log(list)
		    let kw=yield select(({cwkmgl})=>cwkmgl.kw)
		    yield put({
		    	type:'updatePayload',
		    	payload:{
		    		show_list:kw.length==0?list:list1.filter(function(v){
		    			return v.key2.indexOf(kw)>-1
		    		})
		    	}
		    }) 
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