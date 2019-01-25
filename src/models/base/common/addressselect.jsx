import { httpPost } from '../../../services/HttpService';
import { config } from '../../../services/HttpService';
import { routerRedux } from 'dva/router';
import key from 'keymaster';

export default {

    namespace: 'addressselect',

    state: {   	
	
		//全量省份及城市列表数据
		allData: [],
		//选择后的结果数据
		resultData: [],
		//省级列表高亮位置
		leftIndex:0,
		//modal是否显示
		modalVisible:false,
		//编辑的位置
		editIndex:0,
    },

    subscriptions: {
		setup({ dispatch, history }) {
		  history.listen(location => {
			if (location.pathname === '/welcome') {
			 // dispatch({
			//	type: 'cityLinkage',
			//	payload:{}
			//  });
			}
		  });
		},
    },

    effects: {
		// 省市联动接口
		*cityLinkage({ payload },{select,call,put}){
			
			const url = config.cityLinkageUrl;
			const { data } = yield call(httpPost,url,payload);
			
			if(data){
				if((data.code) && (data.code == 200)){
					
					yield put({
						type: 'citySuccess',
						payload: {
							firstArea: data.contents,
						},
					});
					
				}
			}
		},
	
    },

    reducers: {	
    	/*城市列表接口返回初始化数据*/
		citySuccess(state, action) {

			var newData = action.payload.firstArea;

			if(newData){
				newData.map((j, k) => {

					j.checked = false;
					j.indeterminate = false;

					j.areadata.map((h, i) => {
						h.checked = false;
					})

				})
			}

			return {...state,allData: newData?newData:[]};
		},
		/*仅点击省份*/
		onlyArea(state, action) {

			const {allData}=state;

			const {index}=action.payload;

			return {...state,leftIndex:index};
		},
		/*勾选省份*/
		goChecked(state, action) {

			const {index}=action.payload.value;

			const {checked}=action.payload;

			const {allData}=state;



			if(allData && allData.length >index){

				allData[index].checked=checked;

				if(allData[index].areadata){
					allData[index].areadata.map((x, y) => {

						x.checked = checked;
					})

				}
			}

			return {...state,leftIndex:index,allData:allData};
		},
		/*勾选城市*/
		childChecked(state, action) {

			const {index}=action.payload.value;

			const {checked}=action.payload;

			const {allData,leftIndex}=state;

			if(allData && allData.length >leftIndex){

				if(allData[leftIndex].areadata && allData[leftIndex].areadata.length >index){

					allData[leftIndex].areadata[index].checked=checked;

					var allChecked=true;

					allData[leftIndex].areadata.map((h)=>{
						if(!h.checked){
							allChecked=false;
						}
					});

					allData[leftIndex].checked=allChecked;


				}

			}
			return {...state,allData:allData};
		},

		/*显示Modal*/
		showModal(state, action) {

			const {allData,resultData}=state;

			var dataMap=new Map();

			if(resultData){
				resultData.map((h,i)=>{
					if(h.areadata&&h.areadata.length==0){
						dataMap.set(h.areaid,true);
					}else if(h.areadata){
						h.areadata.map((j,k)=>{
							dataMap.set(j.areaid,true);
						});
					}				
				});
			}

			if(allData){
				allData.map((h,i)=>{
					if(dataMap.get(h.areaid)){
						h.checked=true;
						if(h.areadata){
							h.areadata.map((j,k)=>{
								j.checked=true;
							});
						}
					}else {
						h.checked=false;
						if(h.areadata){
							h.areadata.map((j,k)=>{
								if(dataMap.get(j.areaid)){
									j.checked=true;
								}else{
									j.checked=false;
								}
							});
						}
					}
				});
			}

			return {...state,modalVisible:true,allData:allData,editIndex:action.payload?action.payload.editIndex:0};
		},
		/*取消Modal*/
		cancelModal(state, action) {
			return {...state,modalVisible:false};
		},
		/*确认Modal*/
		confirmModal(state, action) {
			const {allData}=state;
			var resultData=[];

			if(allData){
				allData.map((h,i)=>{

					var allChecked = true;
					var areadata=[];

					if(h.areadata){

						h.areadata.map((j,k)=>{

							if(j.checked){
								areadata.push({
									areaname:j.areaname,
									areaid:j.areaid,
								});
								
							}else{
								allChecked=false;
							}
						});

					}

					if(allChecked){
						resultData.push({
							areaname:h.areaname,
							areaid:h.areaid,
							areadata:[],
						});
					}else if(areadata.length>0){
						resultData.push({
							areaname:h.areaname,
							areaid:h.areaid,
							areadata:areadata,
						});
					}
				});
			}

			return {...state,modalVisible:false,resultData:resultData};
		},
		/*初始化选择城市数据*/
		initData(state, action) {
			const resultData=action.payload.data;
			return {...state,modalVisible:false,resultData:resultData,leftIndex:0};
		},			
    },

};













